package co.com.arena.real.infrastructure.dto.rs;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serial;
import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.UUID;


@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PartidaResponse implements Serializable {
    @Serial
    private static final long serialVersionUID = -3027872519672020479L;

    private UUID id;
    private UUID apuestaId;
    private String ganadorId;
    private boolean validada;
    private LocalDateTime validadaEn;
}
