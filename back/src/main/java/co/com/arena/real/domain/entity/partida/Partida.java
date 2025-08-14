package co.com.arena.real.domain.entity.partida;

import co.com.arena.real.domain.entity.Apuesta;
import co.com.arena.real.domain.entity.Jugador;
import co.com.arena.real.domain.entity.partida.ResultadoJugador;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Lob;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.math.BigDecimal;
import java.util.UUID;

@Entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Partida {

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
    @Column(name = "modo_juego")
    private ModoJuego modoJuego;

    @Enumerated(EnumType.STRING)
    private EstadoPartida estado;

    @Column(name = "creada_en")
    private LocalDateTime creada;

    @Column(nullable = false)
    private BigDecimal monto;

    @Column(name = "chat_id")
    private UUID chatId;

    @Builder.Default
    @Column(name = "aceptado_jugador1")
    private boolean aceptadoJugador1 = false;

    @Builder.Default
    @Column(name = "aceptado_jugador2")
    private boolean aceptadoJugador2 = false;

    private boolean validada;

    @Column(name = "validada_en")
    private LocalDateTime validadaEn;

    @OneToOne
    @JoinColumn(name = "apuesta_id")
    private Apuesta apuesta;

    @ManyToOne
    @JoinColumn(name = "ganador_id")
    private Jugador ganador;

    @Enumerated(EnumType.STRING)
    @Column(name = "resultado_jugador1")
    private ResultadoJugador resultadoJugador1;

    @Enumerated(EnumType.STRING)
    @Column(name = "resultado_jugador2")
    private ResultadoJugador resultadoJugador2;

    @Lob
    @Column(name = "captura_jugador1", columnDefinition = "text")
    private String capturaJugador1;

    @Lob
    @Column(name = "captura_jugador2", columnDefinition = "text")
    private String capturaJugador2;

    @Builder.Default
    @Column(name = "revancha_count")
    private int revanchaCount = 0;
}
