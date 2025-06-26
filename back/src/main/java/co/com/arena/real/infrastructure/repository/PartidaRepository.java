package co.com.arena.real.infrastructure.repository;

import co.com.arena.real.domain.entity.partida.EstadoPartida;
import co.com.arena.real.domain.entity.partida.Partida;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Collection;
import java.util.Optional;
import java.util.UUID;

public interface PartidaRepository extends JpaRepository<Partida, UUID> {
    Optional<Partida> findByApuesta_Id(UUID apuestaId);

    @Query("SELECT COUNT(p) > 0 FROM Partida p WHERE (p.jugador1.id = :jugadorId OR p.jugador2.id = :jugadorId) AND p.estado IN :estados")
    boolean existsActiveByJugador(@Param("jugadorId") String jugadorId, @Param("estados") Collection<EstadoPartida> estados);

}
