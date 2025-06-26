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
public class JugadorResponse implements Serializable {
    @Serial
    private static final long serialVersionUID = -2339427444299457151L;

    private String id;
    private String nombre;
    private String email;
    private String telefono;
    private String tagClash;
    private String linkAmistad;
    private BigDecimal saldo;
    private Integer reputacion;

}
