package co.com.arena.real.infrastructure.repository;

import co.com.arena.real.domain.entity.Jugador;
import org.springframework.data.jpa.repository.JpaRepository;

public interface JugadorRepository extends JpaRepository<Jugador, String> {
    boolean existsByEmail(String email);

    boolean existsByTelefono(String telefono);

}
