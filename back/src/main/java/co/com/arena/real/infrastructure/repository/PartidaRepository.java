package co.com.arena.real.infrastructure.repository;

import co.com.arena.real.domain.entity.partida.EstadoPartida;
import co.com.arena.real.domain.entity.partida.Partida;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import jakarta.persistence.LockModeType;

import java.util.Collection;
import java.util.Optional;
import java.util.UUID;

public interface PartidaRepository extends JpaRepository<Partida, UUID> {
    Optional<Partida> findByApuesta_Id(UUID apuestaId);
    @Query("SELECT p FROM Partida p WHERE p.chatId = :chatId")
    Optional<Partida> findByChatId(@Param("chatId") UUID chatId);
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT p FROM Partida p WHERE p.id = :id")
    Optional<Partida> findByIdForUpdate(@Param("id") UUID id);

    @Query("SELECT COUNT(p) > 0 FROM Partida p WHERE (p.jugador1.id = :jugadorId OR p.jugador2.id = :jugadorId) AND p.estado IN :estados")
    boolean existsActiveByJugador(@Param("jugadorId") String jugadorId, @Param("estados") Collection<EstadoPartida> estados);

    @Query("SELECT p FROM Partida p WHERE (p.jugador1.id = :jugadorId OR p.jugador2.id = :jugadorId) AND p.estado = :estado ORDER BY p.creada DESC")
    java.util.List<Partida> findByJugadorAndEstado(@Param("jugadorId") String jugadorId, @Param("estado") EstadoPartida estado);

}
