package co.com.arena.real.domain.entity.partida;

import co.com.arena.real.domain.entity.Apuesta;
import co.com.arena.real.domain.entity.Jugador;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
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

    @Column(name = "chat_id")
    private UUID chatId;

    private boolean validada;

    @Column(name = "validada_en")
    private LocalDateTime validadaEn;

    @OneToOne
    @JoinColumn(name = "apuesta_id")
    private Apuesta apuesta;

    @ManyToOne
    @JoinColumn(name = "ganador_id")
    private Jugador ganador;
}