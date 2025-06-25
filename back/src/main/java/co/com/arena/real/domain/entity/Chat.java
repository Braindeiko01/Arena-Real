package co.com.arena.real.domain.entity;

import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.UUID;

@Entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Chat {

    //todo: seguramente termine siendo el id de un servicio de mensajería
    @Id
    @GeneratedValue
    @Column(columnDefinition = "uuid", updatable = false, nullable = false)
    private UUID id;

    @ElementCollection
    @CollectionTable(name = "chat_jugadores", joinColumns = @JoinColumn(name = "chat_id"))
    @Column(name = "jugador_id")
    private List<String> jugadores;

    @Column(nullable = false)

    @Builder.Default
    private boolean activo = true;

}
