package co.com.arena.real.websocket;

import co.com.arena.real.infrastructure.dto.rs.TransaccionResponse;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.PingMessage;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;

import java.io.IOException;
import java.nio.ByteBuffer;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
@RequiredArgsConstructor
public class WsService {

    private static final Logger log = LoggerFactory.getLogger(WsService.class);

    private static class SessionWrapper {
        final WebSocketSession session;
        volatile long lastAccess;

        SessionWrapper(WebSocketSession session) {
            this.session = session;
            this.lastAccess = System.currentTimeMillis();
        }
    }

    private final ObjectMapper mapper = new ObjectMapper();
    private final Map<String, SessionWrapper> sessions = new ConcurrentHashMap<>();

    public void register(String jugadorId, WebSocketSession session) {
        SessionWrapper previous = sessions.put(jugadorId, new SessionWrapper(session));
        if (previous != null && previous.session.isOpen()) {
            try {
                previous.session.close(new CloseStatus(1001, "nueva conexion"));
            } catch (IOException ignored) {
            }
        }
        log.info("Nueva conexión WS para jugador: {}", jugadorId);
    }

    public void remove(String jugadorId) {
        sessions.remove(jugadorId);
        log.info("Desconectado WS jugador: {}", jugadorId);
    }

    public void notificarTransaccionAprobada(TransaccionResponse dto) {
        sendEvent(dto.getJugadorId(), "transaccion-aprobada", dto);
    }

    public void sendEvent(String jugadorId, String eventName, Object data) {
        SessionWrapper wrapper = sessions.get(jugadorId);
        if (wrapper == null || !wrapper.session.isOpen()) {
            return;
        }
        try {
            Map<String, Object> payload = Map.of(
                    "event", eventName,
                    "data", data
            );
            wrapper.session.sendMessage(new TextMessage(mapper.writeValueAsString(payload)));
            wrapper.lastAccess = System.currentTimeMillis();
        } catch (IOException e) {
            remove(jugadorId);
            try {
                wrapper.session.close(CloseStatus.SERVER_ERROR);
            } catch (IOException ex) {
                // ignore
            }
        }
    }

    @Scheduled(fixedRate = 15000)
    public void sendHeartbeats() {
        sessions.forEach((id, wrapper) -> {
            try {
                if (wrapper.session.isOpen()) {
                    wrapper.session.sendMessage(new PingMessage(ByteBuffer.allocate(0)));
                    wrapper.lastAccess = System.currentTimeMillis();
                }
            } catch (IOException e) {
                remove(id);
                try {
                    wrapper.session.close(CloseStatus.SERVER_ERROR);
                } catch (IOException ignored) {
                }
            }
        });
    }

    @Scheduled(fixedRate = 60000)
    public void limpiarSesiones() {
        long now = System.currentTimeMillis();
        long ttl = 5 * 60 * 1000L;
        sessions.forEach((id, wrapper) -> {
            if (!wrapper.session.isOpen() || now - wrapper.lastAccess > ttl) {
                remove(id);
                try {
                    wrapper.session.close(CloseStatus.GOING_AWAY);
                } catch (IOException ignored) {
                }
            }
        });
    }
}

