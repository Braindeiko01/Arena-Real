package co.com.arena.real.domain.entity.partida;

import co.com.arena.real.domain.entity.Jugador;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.UUID;

@Entity
@Table(name = "partidas_en_espera")
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Data
public class PartidaEnEspera {

    @Id
    @GeneratedValue
    @Column(columnDefinition = "uuid", updatable = false, nullable = false)
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "jugador_id")
    private Jugador jugador;

    @Enumerated(EnumType.STRING)
    @Column(name = "modo_juego", nullable = false)
    private ModoJuego modoJuego;

    @Column(nullable = false)
    private BigDecimal monto;


}

