package co.com.arena.real.infrastructure.dto.rq;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PartidaResultadoRequest {
    private String jugadorId;
    private String resultado; // VICTORIA, DERROTA o EMPATE
    private String captura;
}
