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
    private UUID chatId;
    private String jugador1Id;
    private String jugador2Id;
    private String ganadorId;
    private String modoJuego;
    private String estado;
    private boolean validada;
    private LocalDateTime creada;
    private LocalDateTime validadaEn;
    private java.math.BigDecimal monto;
    private String capturaJugador1;
    private String capturaJugador2;
    private String resultadoJugador1;
    private String resultadoJugador2;
}
