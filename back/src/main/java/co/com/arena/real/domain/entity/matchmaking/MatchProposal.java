package co.com.arena.real.domain.entity.matchmaking;

import co.com.arena.real.domain.entity.Jugador;
import co.com.arena.real.domain.entity.partida.ModoJuego;
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
@Table(name = "match_proposals")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MatchProposal {

    @Id
    @GeneratedValue
    @Column(columnDefinition = "uuid", updatable = false, nullable = false)
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "jugador1_id")
    private Jugador jugador1;

    @ManyToOne
    @JoinColumn(name = "jugador2_id")
    private Jugador jugador2;

    @Enumerated(EnumType.STRING)
    @Column(name = "modo_juego", nullable = false)
    private ModoJuego modoJuego;

    @Column(nullable = false)
    private BigDecimal monto;

    @Builder.Default
    @Column(name = "aceptado_jugador1")
    private boolean aceptadoJugador1 = false;

    @Builder.Default
    @Column(name = "aceptado_jugador2")
    private boolean aceptadoJugador2 = false;
}
