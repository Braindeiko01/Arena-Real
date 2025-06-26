package co.com.arena.real.infrastructure.dto.rq;

import co.com.arena.real.domain.entity.TipoTransaccion;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serial;
import java.io.Serializable;
import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TransaccionRequest implements Serializable {
    @Serial
    private static final long serialVersionUID = 298120322987427100L;

    private String jugadorId;
    private BigDecimal monto;
    private TipoTransaccion tipo;

}
