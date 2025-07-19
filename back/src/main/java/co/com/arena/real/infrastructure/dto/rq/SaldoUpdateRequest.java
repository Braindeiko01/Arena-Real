package co.com.arena.real.infrastructure.dto.rq;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serial;
import java.io.Serializable;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SaldoUpdateRequest implements Serializable {
    @Serial
    private static final long serialVersionUID = 39652193486723042L;

    private String userId;
}
