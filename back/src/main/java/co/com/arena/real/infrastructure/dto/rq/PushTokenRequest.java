package co.com.arena.real.infrastructure.dto.rq;

import lombok.Data;

@Data
public class PushTokenRequest {
    private String jugadorId;
    private String token;
}
