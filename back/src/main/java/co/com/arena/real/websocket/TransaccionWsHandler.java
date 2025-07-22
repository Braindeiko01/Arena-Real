package co.com.arena.real.websocket;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

@Component
@RequiredArgsConstructor
public class TransaccionWsHandler extends TextWebSocketHandler {

    private final WsService wsService;

    @Override
    public void afterConnectionEstablished(WebSocketSession session) {
        Object id = session.getAttributes().get("jugadorId");
        if (id != null) {
            wsService.register(id.toString(), session);
        }
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) {
        Object id = session.getAttributes().get("jugadorId");
        if (id != null) {
            wsService.remove(id.toString());
        }
    }
}

