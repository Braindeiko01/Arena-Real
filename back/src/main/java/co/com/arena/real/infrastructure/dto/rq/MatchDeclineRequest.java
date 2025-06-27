package co.com.arena.real.infrastructure.dto.rq;

import lombok.Data;

@Data
public class MatchDeclineRequest {
    private String jugadorId;
    private String oponenteId;
}
