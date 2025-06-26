package co.com.arena.real.domain.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Entity
@Table(name = "jugadores")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Jugador {

    @Id
    @Column(name = "id", unique = true)
    private String id;

    private String nombre;

    @Column(unique = true)
    private String email;

    @Column(unique = true)
    private String telefono;

    @Column(name = "tag_clash", unique = true)
    private String tagClash;

    @Column(name = "link_amistad")
    private String linkAmistad;

    @Builder.Default
    private BigDecimal saldo = BigDecimal.ZERO;

    @Builder.Default
    private Integer reputacion = 100;

    public Jugador(String id) {
        this.id = id;
    }
}
