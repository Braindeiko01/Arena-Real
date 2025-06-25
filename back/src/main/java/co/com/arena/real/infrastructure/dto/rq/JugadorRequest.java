package co.com.arena.real.infrastructure.dto.rq;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
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
public class JugadorRequest implements Serializable {
    @Serial
    private static final long serialVersionUID = -1079360589218994359L;

    @NotBlank
    private String id;

    @NotBlank(message = "El nombre es obligatorio")
    @Size(max = 100)
    private String nombre;

    @Email(message = "Correo inválido")
    @NotBlank
    private String email;

    @NotBlank
    @Pattern(regexp = "^\\+?\\d{7,15}$", message = "Número de teléfono inválido")
    private String telefono;

    @Pattern(
            regexp = "^(https://link\\.clashroyale\\.com/invite/friend(?:/[a-zA-Z]{2})?.*tag=[A-Za-z0-9]+.*)?$",
            message = "Enlace de amistad inválido"
    )
    private String linkAmistad;

}
