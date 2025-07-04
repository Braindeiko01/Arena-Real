package co.com.arena.real.domain.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Representa una apuesta realizada entre dos jugadores.
 */

@Entity
@Table(name = "apuestas")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Apuesta {

    @Id
    @GeneratedValue
    @Column(columnDefinition = "uuid", updatable = false, nullable = false)
    private UUID id;

    @Column(nullable = false)
    private BigDecimal monto;

    @Column(nullable = false)
    private BigDecimal comision;

    @Column(nullable = false)
    private BigDecimal premio;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EstadoApuesta estado;

    @Column(name = "creado_en", nullable = false)
    private LocalDateTime creadoEn;

    public Apuesta(UUID id) {
        this.id = id;
    }
}
