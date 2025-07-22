package co.com.arena.real.websocket;

import co.com.arena.real.domain.entity.Jugador;
import co.com.arena.real.domain.entity.partida.Partida;
import co.com.arena.real.infrastructure.dto.rs.MatchSseDto;
import co.com.arena.real.infrastructure.dto.rs.PartidaResponse;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;

import java.io.IOException;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;

@Service
@RequiredArgsConstructor
public class MatchWsService {

    private static final Logger log = LoggerFactory.getLogger(MatchWsService.class);

    private static class SessionWrapper {
        final WebSocketSession session;
        volatile long lastAccess;

        SessionWrapper(WebSocketSession session) {
            this.session = session;
            this.lastAccess = System.currentTimeMillis();
        }
    }

    private static class LatestEvent {
        final String name;
        final MatchSseDto dto;
        LatestEvent(String name, MatchSseDto dto) { this.name = name; this.dto = dto; }
    }

    private final ConcurrentMap<String, SessionWrapper> sessions = new ConcurrentHashMap<>();
    private final ConcurrentMap<String, LatestEvent> latestEvents = new ConcurrentHashMap<>();
    private final ObjectMapper mapper = new ObjectMapper();

    public void register(String jugadorId, WebSocketSession session) {
        SessionWrapper wrapper = new SessionWrapper(session);
        SessionWrapper previous = sessions.put(jugadorId, wrapper);
        if (previous != null && previous.session.isOpen()) {
            try {
                previous.session.close(new CloseStatus(1001, "nueva conexion"));
            } catch (IOException ignored) {
            }
        }
        LatestEvent last = latestEvents.remove(jugadorId);
        if (last != null) {
            sendEvent(jugadorId, last.name, last.dto);
        }
        log.info("Nueva conexión WS para jugador: {}", jugadorId);
    }

    public void remove(String jugadorId, WebSocketSession session) {
        sessions.computeIfPresent(jugadorId, (id, wrapper) ->
                wrapper.session.equals(session) ? null : wrapper);
        log.info("Desconectado WS jugador: {}", jugadorId);
    }

    private void sendEvent(String jugadorId, String event, Object dto) {
        SessionWrapper wrapper = sessions.get(jugadorId);
        if (wrapper == null || !wrapper.session.isOpen()) {
            latestEvents.put(jugadorId, new LatestEvent(event, (MatchSseDto) dto));
            return;
        }
        try {
            Map<String, Object> payload = Map.of("event", event, "data", dto);
            wrapper.session.sendMessage(new TextMessage(mapper.writeValueAsString(payload)));
            wrapper.lastAccess = System.currentTimeMillis();
        } catch (IOException e) {
            sessions.remove(jugadorId);
            try { wrapper.session.close(CloseStatus.SERVER_ERROR); } catch (IOException ex) {}
        }
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

    public void notifyMatchValidated(PartidaResponse partida) {
        sendMatchValidated(partida.getJugador1Id(), partida);
        sendMatchValidated(partida.getJugador2Id(), partida);
    }

    public void notifyRematchAvailable(PartidaResponse partida) {
        sendRematchAvailable(partida.getJugador1Id(), partida);
        sendRematchAvailable(partida.getJugador2Id(), partida);
    }

    private void sendMatchFound(String receptorId, UUID apuestaId, UUID partidaId, Jugador oponente) {
        String tag = oponente.getTagClash() != null ? oponente.getTagClash() : oponente.getNombre();
        String nombre = oponente.getNombre() != null ? oponente.getNombre() : tag;
        MatchSseDto dto = MatchSseDto.builder()
                .apuestaId(apuestaId)
                .partidaId(partidaId)
                .jugadorOponenteId(oponente.getId())
                .jugadorOponenteTag(tag)
                .jugadorOponenteNombre(nombre)
                .build();
        latestEvents.put(receptorId, new LatestEvent("match-found", dto));
        sendEvent(receptorId, "match-found", dto);
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
        sendEvent(receptorId, "chat-ready", dto);
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
        sendEvent(receptorId, "opponent-accepted", dto);
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
        sendEvent(receptorId, "match-cancelled", dto);
    }

    private void sendMatchValidated(String receptorId, PartidaResponse partida) {
        if (receptorId == null) {
            return;
        }
        MatchSseDto dto = MatchSseDto.builder()
                .apuestaId(partida.getApuestaId())
                .partidaId(partida.getId())
                .build();
        latestEvents.put(receptorId, new LatestEvent("match-validated", dto));
        sendEvent(receptorId, "match-validated", dto);
    }

    private void sendRematchAvailable(String receptorId, PartidaResponse partida) {
        if (receptorId == null) {
            return;
        }
        MatchSseDto dto = MatchSseDto.builder()
                .apuestaId(partida.getApuestaId())
                .partidaId(partida.getId())
                .build();
        latestEvents.put(receptorId, new LatestEvent("rematch-available", dto));
        sendEvent(receptorId, "rematch-available", dto);
    }
}

