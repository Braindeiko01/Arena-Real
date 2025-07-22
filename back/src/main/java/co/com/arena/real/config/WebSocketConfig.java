package co.com.arena.real.config;

import co.com.arena.real.websocket.MatchWsHandler;
import co.com.arena.real.websocket.TransaccionWsHandler;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;

@Configuration
@EnableWebSocket
public class WebSocketConfig implements WebSocketConfigurer {

    private final TransaccionWsHandler transaccionWsHandler;
    private final MatchWsHandler matchWsHandler;

    public WebSocketConfig(TransaccionWsHandler transaccionWsHandler, MatchWsHandler matchWsHandler) {
        this.transaccionWsHandler = transaccionWsHandler;
        this.matchWsHandler = matchWsHandler;
    }

    @Override
    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
        registry.addHandler(transaccionWsHandler, "/ws/transacciones/{jugadorId}")
                .setAllowedOrigins("http://localhost:3000", "http://localhost:3001")
                .addInterceptors(new PlayerIdHandshakeInterceptor());
        registry.addHandler(matchWsHandler, "/ws/matchmaking/{jugadorId}")
                .setAllowedOrigins("http://localhost:3000", "http://localhost:3001")
                .addInterceptors(new PlayerIdHandshakeInterceptor());
    }
}

