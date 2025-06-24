package co.com.arena.real.infrastructure.repository;

import co.com.arena.real.domain.entity.Apuesta;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface ApuestaRepository extends JpaRepository<Apuesta, UUID> {
}
