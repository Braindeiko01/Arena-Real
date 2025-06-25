package co.com.arena.real.infrastructure.dto.rs;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serial;
import java.io.Serializable;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MatchSseDto implements Serializable {
    @Serial
    private static final long serialVersionUID = -5076615234782375916L;

    private UUID apuestaId;
    private String jugadorOponenteId;
    private String jugadorOponenteTag;
    private UUID chatId;

}
