package co.com.arena.real.infrastructure.dto.rs;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serial;
import java.io.Serializable;
import java.math.BigDecimal;
import java.util.UUID;


@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MatchResultDto implements Serializable {
    @Serial
    private static final long serialVersionUID = -8418829763317647957L;

    private UUID apuestaId;
    private UUID jugador1Id;
    private UUID jugador2Id;
    private BigDecimal monto;
    private String modoJuego;

}
