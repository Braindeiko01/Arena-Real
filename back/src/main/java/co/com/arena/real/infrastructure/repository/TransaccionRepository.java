package co.com.arena.real.infrastructure.repository;

import co.com.arena.real.domain.entity.Transaccion;
import co.com.arena.real.domain.entity.EstadoTransaccion;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface TransaccionRepository extends JpaRepository<Transaccion, UUID> {
    List<Transaccion> findByJugador_Id(String jugadorId);
    List<Transaccion> findByEstado(EstadoTransaccion estado);
}
