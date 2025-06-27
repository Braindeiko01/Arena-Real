package co.com.arena.real.infrastructure.dto.rq;

import lombok.Data;

@Data
public class MatchPenaltyRequest {
    private String jugadorId;
    private String oponenteId;
}
