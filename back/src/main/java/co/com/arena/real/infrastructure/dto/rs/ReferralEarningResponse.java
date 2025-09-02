package co.com.arena.real.infrastructure.dto.rs;

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
public class ReferralEarningResponse implements Serializable {
    @Serial
    private static final long serialVersionUID = 1L;

    private String referredName;
    private BigDecimal amount;
}
