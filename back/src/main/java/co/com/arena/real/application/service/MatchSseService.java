package co.com.arena.real.application.service;

import co.com.arena.real.domain.entity.Jugador;
import co.com.arena.real.domain.entity.partida.Partida;
import co.com.arena.real.infrastructure.dto.rs.MatchSseDto;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import lombok.RequiredArgsConstructor;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CompletableFuture;

@Service
@RequiredArgsConstructor
public class MatchSseService {

    private static final Logger log = LoggerFactory.getLogger(MatchSseService.class);

    private final PushNotificationService pushNotificationService;

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
        String lock = ("lock_" + jugadorId).intern();
        synchronized (lock) {
            EmitterWrapper existing = emitters.remove(jugadorId);
            if (existing != null) {
                existing.emitter.complete();
            }

            SseEmitter emitter = new SseEmitter(Long.MAX_VALUE);
            EmitterWrapper wrapper = new EmitterWrapper(emitter);
            emitters.put(jugadorId, wrapper);

            emitter.onCompletion(() -> removeEmitter(jugadorId));
            emitter.onTimeout(() -> removeEmitter(jugadorId));
            emitter.onError(ex -> removeEmitter(jugadorId));

            LatestEvent last = latestEvents.get(jugadorId);
            if (last != null) {
                CompletableFuture.runAsync(() -> {
                    try {
                        wrapper.emitter.send(SseEmitter.event()
                                .name(last.name())
                                .data(last.dto()));
                        wrapper.lastAccess = System.currentTimeMillis();
                        latestEvents.remove(jugadorId);
                    } catch (IOException e) {
                        removeEmitter(jugadorId);
                        wrapper.emitter.completeWithError(e);
                    }
                });
            }

            log.info("Nueva conexión SSE para jugador: {}", jugadorId);
            return emitter;
        }
    }

    public void notifyMatchFound(UUID apuestaId, UUID partidaId, Jugador jugador1, Jugador jugador2, boolean revancha) {
        sendMatchFound(jugador1.getId(), apuestaId, partidaId, jugador2, revancha);
        sendMatchFound(jugador2.getId(), apuestaId, partidaId, jugador1, revancha);
    }

    public void notifyMatchFound(UUID apuestaId, UUID partidaId, Jugador jugador1, Jugador jugador2) {
        notifyMatchFound(apuestaId, partidaId, jugador1, jugador2, false);
    }

    public void notifyMatchFound(Partida partida) {
        notifyMatchFound(partida, false);
    }

    public void notifyMatchFound(Partida partida, boolean revancha) {
        UUID apuestaId = partida.getApuesta() != null ? partida.getApuesta().getId() : null;
        UUID partidaId = partida.getId();
        notifyMatchFound(apuestaId, partidaId, partida.getJugador1(), partida.getJugador2(), revancha);
    }

    public void notifyChatReady(Partida partida) {
        UUID apuestaId = partida.getApuesta().getId();
        UUID chatId = partida.getChatId();
        UUID partidaId = partida.getId();
        sendChatReady(partida.getJugador1().getId(), apuestaId, partidaId, chatId, partida.getJugador2());
        sendChatReady(partida.getJugador2().getId(), apuestaId, partidaId, chatId, partida.getJugador1());
    }

    public void notifyOpponentAccepted(UUID apuestaId, UUID partidaId, Jugador aceptante, Jugador receptor) {
        if (receptor == null) {
            return;
        }
        sendOpponentAccepted(receptor.getId(), apuestaId, partidaId, aceptante);
    }

    public void notifyMatchCancelled(UUID partidaId, Jugador declinante, Jugador receptor) {
        if (receptor == null) {
            return;
        }
        sendMatchCancelled(receptor.getId(), partidaId, declinante);
    }

    public void notifyMatchValidated(co.com.arena.real.infrastructure.dto.rs.PartidaResponse partida) {
        sendMatchValidated(partida.getJugador1Id(), partida);
        sendMatchValidated(partida.getJugador2Id(), partida);
    }

    private void sendMatchFound(String receptorId, UUID apuestaId, UUID partidaId, Jugador oponente, boolean revancha) {
        String tag = oponente.getTagClash() != null ? oponente.getTagClash() : oponente.getNombre();
        String nombre = oponente.getNombre() != null ? oponente.getNombre() : tag;
        MatchSseDto dto = MatchSseDto.builder()
                .apuestaId(apuestaId)
                .partidaId(partidaId)
                .jugadorOponenteId(oponente.getId())
                .jugadorOponenteTag(tag)
                .jugadorOponenteNombre(nombre)
                .revancha(revancha)
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
            removeEmitter(receptorId);
            wrapper.emitter.completeWithError(e);
        }
    }

    public void notifyResultSubmitted(Partida partida, String jugadorId) {
        String receptorId = null;
        if (partida.getJugador1() != null && partida.getJugador1().getId().equals(jugadorId)) {
            receptorId = partida.getJugador2() != null ? partida.getJugador2().getId() : null;
        } else if (partida.getJugador2() != null && partida.getJugador2().getId().equals(jugadorId)) {
            receptorId = partida.getJugador1() != null ? partida.getJugador1().getId() : null;
        }
        if (receptorId == null) {
            return;
        }
        MatchSseDto dto = MatchSseDto.builder()
                .partidaId(partida.getId())
                .jugadorOponenteId(jugadorId)
                .build();
        latestEvents.put(receptorId, new LatestEvent("player-voted", dto));

        EmitterWrapper wrapper = emitters.get(receptorId);
        if (wrapper == null) {
            return;
        }
        try {
            wrapper.emitter.send(SseEmitter.event()
                    .name("player-voted")
                    .data(dto));
            wrapper.lastAccess = System.currentTimeMillis();
            latestEvents.remove(receptorId);
        } catch (IOException e) {
            removeEmitter(receptorId);
            wrapper.emitter.completeWithError(e);
        }
    }

    private void sendChatReady(String receptorId, UUID apuestaId, UUID partidaId, UUID chatId, Jugador oponente) {
        String tag = oponente.getTagClash() != null ? oponente.getTagClash() : oponente.getNombre();
        String nombre = oponente.getNombre() != null ? oponente.getNombre() : tag;
        MatchSseDto dto = MatchSseDto.builder()
                .apuestaId(apuestaId)
                .partidaId(partidaId)
                .chatId(chatId)
                .jugadorOponenteId(oponente.getId())
                .jugadorOponenteTag(tag)
                .jugadorOponenteNombre(nombre)
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
            removeEmitter(receptorId);
            wrapper.emitter.completeWithError(e);
        }
    }

    private void sendOpponentAccepted(String receptorId, UUID apuestaId, UUID partidaId, Jugador aceptante) {
        String tag = aceptante.getTagClash() != null ? aceptante.getTagClash() : aceptante.getNombre();
        String nombre = aceptante.getNombre() != null ? aceptante.getNombre() : tag;
        MatchSseDto dto = MatchSseDto.builder()
                .apuestaId(apuestaId)
                .partidaId(partidaId)
                .jugadorOponenteId(aceptante.getId())
                .jugadorOponenteTag(tag)
                .jugadorOponenteNombre(nombre)
                .build();
        latestEvents.put(receptorId, new LatestEvent("opponent-accepted", dto));

        EmitterWrapper wrapper = emitters.get(receptorId);
        if (wrapper == null) {
            return;
        }
        try {
            wrapper.emitter.send(SseEmitter.event()
                    .name("opponent-accepted")
                    .data(dto));
            wrapper.lastAccess = System.currentTimeMillis();
            latestEvents.remove(receptorId);
        } catch (IOException e) {
            removeEmitter(receptorId);
            wrapper.emitter.completeWithError(e);
        }
    }

    private void sendMatchCancelled(String receptorId, UUID partidaId, Jugador declinante) {
        String tag = declinante.getTagClash() != null ? declinante.getTagClash() : declinante.getNombre();
        String nombre = declinante.getNombre() != null ? declinante.getNombre() : tag;
        MatchSseDto dto = MatchSseDto.builder()
                .partidaId(partidaId)
                .jugadorOponenteId(declinante.getId())
                .jugadorOponenteTag(tag)
                .jugadorOponenteNombre(nombre)
                .build();
        latestEvents.put(receptorId, new LatestEvent("match-cancelled", dto));

        EmitterWrapper wrapper = emitters.get(receptorId);
        if (wrapper == null) {
            return;
        }
        try {
            wrapper.emitter.send(SseEmitter.event()
                    .name("match-cancelled")
                    .data(dto));
            wrapper.lastAccess = System.currentTimeMillis();
            latestEvents.remove(receptorId);
        } catch (IOException e) {
            removeEmitter(receptorId);
            wrapper.emitter.completeWithError(e);
        }
    }

    private void sendMatchValidated(String receptorId, co.com.arena.real.infrastructure.dto.rs.PartidaResponse partida) {
        if (receptorId == null) {
            return;
        }
        MatchSseDto dto = MatchSseDto.builder()
                .apuestaId(partida.getApuestaId())
                .partidaId(partida.getId())
                .build();
        latestEvents.put(receptorId, new LatestEvent("match-validated", dto));

        EmitterWrapper wrapper = emitters.get(receptorId);
        if (wrapper == null) {
            return;
        }
        try {
            wrapper.emitter.send(SseEmitter.event()
                    .name("match-validated")
                    .data(dto));
            wrapper.lastAccess = System.currentTimeMillis();
            latestEvents.remove(receptorId);
        } catch (IOException e) {
            removeEmitter(receptorId);
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
            removeEmitter(receptorId);
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
                removeEmitter(id);
            }
        });
    }

    @Scheduled(fixedRate = 60000)
    public void limpiarEmitters() {
        long now = System.currentTimeMillis();
        long ttl = 5 * 60 * 1000L;
        emitters.forEach((id, wrapper) -> {
            if (now - wrapper.lastAccess > ttl) {
                removeEmitter(id);
                wrapper.emitter.complete();
            }
        });
    }

    private void removeEmitter(String jugadorId) {
        emitters.remove(jugadorId);
        log.info("Desconectado SSE jugador: {}", jugadorId);
    }
}
