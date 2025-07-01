package co.com.arena.real.infrastructure.repository;

import co.com.arena.real.domain.entity.Jugador;
import co.com.arena.real.domain.entity.partida.ModoJuego;
import co.com.arena.real.domain.entity.partida.PartidaEnEspera;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Repository
public interface PartidaEnEsperaRepository extends JpaRepository<PartidaEnEspera, UUID> {

    @Query("SELECT p FROM PartidaEnEspera p WHERE p.modoJuego = :modo AND p.monto = :monto ORDER BY p.creadaEn ASC")
    List<PartidaEnEspera> findByModoJuegoAndMontoOrderByCreadaEnAsc(@Param("modo") ModoJuego modoJuego,
                                                                    @Param("monto") BigDecimal monto);

    @Query("SELECT p FROM PartidaEnEspera p WHERE p.modoJuego = :modo ORDER BY p.creadaEn ASC")
    List<PartidaEnEspera> findByModoJuegoOrderByCreadaEnAsc(@Param("modo") ModoJuego modoJuego);

    List<PartidaEnEspera> findAllByOrderByCreadaEnAsc();

    @Modifying
    @Query("DELETE FROM PartidaEnEspera p WHERE p.creadaEn < :threshold")
    void deleteByCreadaEnBefore(@Param("threshold") java.time.LocalDateTime threshold);

    void deleteByJugador(Jugador jugador);

}
