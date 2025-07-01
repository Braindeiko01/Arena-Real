package co.com.arena.real.application.service;

import co.com.arena.real.domain.entity.Jugador;
import co.com.arena.real.domain.entity.partida.Partida;
import co.com.arena.real.infrastructure.dto.rs.MatchSseDto;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class MatchSseService {

    private static class EmitterWrapper {
        final SseEmitter emitter;
        volatile long lastAccess;

        EmitterWrapper(SseEmitter emitter) {
            this.emitter = emitter;
            this.lastAccess = System.currentTimeMillis();
        }
    }

    private final Map<String, EmitterWrapper> emitters = new ConcurrentHashMap<>();
    private final Map<String, LatestEvent> latestEvents = new ConcurrentHashMap<>();

    private record LatestEvent(String name, MatchSseDto dto) {
    }

    public SseEmitter subscribe(String jugadorId) {
        EmitterWrapper existing = emitters.remove(jugadorId);
        if (existing != null) {
            existing.emitter.complete();
        }

        SseEmitter emitter = new SseEmitter(Long.MAX_VALUE);
        emitters.put(jugadorId, new EmitterWrapper(emitter));
        emitter.onCompletion(() -> emitters.remove(jugadorId));
        emitter.onTimeout(() -> emitters.remove(jugadorId));
        emitter.onError(ex -> emitters.remove(jugadorId));

        LatestEvent last = latestEvents.get(jugadorId);
        if (last != null) {
            try {
                emitter.send(SseEmitter.event().name(last.name()).data(last.dto()));
                latestEvents.remove(jugadorId);
            } catch (IOException e) {
                emitters.remove(jugadorId);
                emitter.completeWithError(e);
            }
        }
        return emitter;
    }

    public void notifyMatchFound(UUID apuestaId, UUID partidaId, Jugador jugador1, Jugador jugador2) {
        sendMatchFound(jugador1.getId(), apuestaId, partidaId, jugador2);
        sendMatchFound(jugador2.getId(), apuestaId, partidaId, jugador1);
    }

    public void notifyMatchFound(Partida partida) {
        UUID apuestaId = partida.getApuesta() != null ? partida.getApuesta().getId() : null;
        UUID partidaId = partida.getId();
        notifyMatchFound(apuestaId, partidaId, partida.getJugador1(), partida.getJugador2());
    }

    public void notifyChatReady(Partida partida) {
        UUID apuestaId = partida.getApuesta().getId();
        UUID chatId = partida.getChatId();
        UUID partidaId = partida.getId();
        sendChatReady(partida.getJugador1().getId(), apuestaId, partidaId, chatId, partida.getJugador2());
        sendChatReady(partida.getJugador2().getId(), apuestaId, partidaId, chatId, partida.getJugador1());
    }

    private void sendMatchFound(String receptorId, UUID apuestaId, UUID partidaId, Jugador oponente) {
        String tag = oponente.getTagClash() != null ? oponente.getTagClash() : oponente.getNombre();
        MatchSseDto dto = MatchSseDto.builder()
                .apuestaId(apuestaId)
                .partidaId(partidaId)
                .jugadorOponenteId(oponente.getId())
                .jugadorOponenteTag(tag)
                .build();
        latestEvents.put(receptorId, new LatestEvent("match-found", dto));

        EmitterWrapper wrapper = emitters.get(receptorId);
        if (wrapper == null) {
            return;
        }
        try {
            wrapper.emitter.send(SseEmitter.event()
                    .name("match-found")
                    .data(dto));
            wrapper.lastAccess = System.currentTimeMillis();
            latestEvents.remove(receptorId);
        } catch (IOException e) {
            emitters.remove(receptorId);
            wrapper.emitter.completeWithError(e);
        }
    }

    private void sendChatReady(String receptorId, UUID apuestaId, UUID partidaId, UUID chatId, Jugador oponente) {
        String tag = oponente.getTagClash() != null ? oponente.getTagClash() : oponente.getNombre();
        MatchSseDto dto = MatchSseDto.builder()
                .apuestaId(apuestaId)
                .partidaId(partidaId)
                .chatId(chatId)
                .jugadorOponenteId(oponente.getId())
                .jugadorOponenteTag(tag)
                .build();
        latestEvents.put(receptorId, new LatestEvent("chat-ready", dto));

        EmitterWrapper wrapper = emitters.get(receptorId);
        if (wrapper == null) {
            return;
        }
        try {
            wrapper.emitter.send(SseEmitter.event()
                    .name("chat-ready")
                    .data(dto));
            wrapper.lastAccess = System.currentTimeMillis();
            latestEvents.remove(receptorId);
        } catch (IOException e) {
            emitters.remove(receptorId);
            wrapper.emitter.completeWithError(e);
        }
    }

    private void sendMatch(String receptorId, Partida partida) {
        EmitterWrapper wrapper = emitters.get(receptorId);
        if (wrapper == null) {
            return;
        }
        Map<String, Object> partidaMap = new HashMap<>();
        partidaMap.put("id", partida.getId());
        Map<String, Object> payload = new HashMap<>();
        payload.put("match", true);
        payload.put("partida", partidaMap);
        try {
            wrapper.emitter.send(SseEmitter.event().data(payload));
            wrapper.lastAccess = System.currentTimeMillis();
        } catch (IOException e) {
            emitters.remove(receptorId);
            wrapper.emitter.completeWithError(e);
        }
    }

    @Scheduled(fixedRate = 15000)
    public void sendHeartbeats() {
        emitters.forEach((id, wrapper) -> {
            try {
                wrapper.emitter.send(SseEmitter.event().comment("heartbeat"));
                wrapper.lastAccess = System.currentTimeMillis();
            } catch (IOException e) {
                emitters.remove(id);
            }
        });
    }

    @Scheduled(fixedRate = 60000)
    public void limpiarEmitters() {
        long now = System.currentTimeMillis();
        long ttl = 5 * 60 * 1000L;
        emitters.forEach((id, wrapper) -> {
            if (now - wrapper.lastAccess > ttl) {
                emitters.remove(id);
                wrapper.emitter.complete();
            }
        });
    }
}
