package co.com.arena.real.config;

import co.com.arena.real.websocket.MatchmakingHandler;
import co.com.arena.real.websocket.TransaccionWsHandler;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;

@Configuration
@EnableWebSocket
@RequiredArgsConstructor
public class WebSocketConfig implements WebSocketConfigurer {

    private final TransaccionWsHandler transaccionWsHandler;
    private final MatchmakingHandler matchmakingHandler;

    @Override
    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
        registry.addHandler(transaccionWsHandler, "/ws/transacciones/{jugadorId}")
                .setAllowedOrigins("http://localhost:3000", "http://localhost:3001")
                .addInterceptors(new PlayerIdHandshakeInterceptor());
        registry.addHandler(matchmakingHandler, "/ws/matchmaking/{jugadorId}")
                .setAllowedOrigins("http://localhost:3000", "http://localhost:3001")
                .addInterceptors(new PlayerIdHandshakeInterceptor());
    }
}

