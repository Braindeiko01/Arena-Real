package co.com.arena.real.infrastructure.dto.rq;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serial;
import java.io.Serializable;
import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ApuestaRequest implements Serializable {
    @Serial
    private static final long serialVersionUID = 2077072453093575730L;

    @NotNull
    private BigDecimal monto;

}