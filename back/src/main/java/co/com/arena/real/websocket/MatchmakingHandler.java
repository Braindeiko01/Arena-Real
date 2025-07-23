package co.com.arena.real.websocket;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

@Component
@RequiredArgsConstructor
public class MatchmakingHandler extends TextWebSocketHandler {

    private final MatchWsService matchWsService;

    @Override
    public void afterConnectionEstablished(WebSocketSession session) {
        Object id = session.getAttributes().get("jugadorId");
        if (id != null) {
            matchWsService.register(id.toString(), session);
        }
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) {
        Object id = session.getAttributes().get("jugadorId");
        if (id != null) {
            matchWsService.remove(id.toString(), session);
        }
    }
}
