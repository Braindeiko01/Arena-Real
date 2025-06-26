package co.com.arena.real.infrastructure.repository;

import co.com.arena.real.domain.entity.Jugador;
import co.com.arena.real.domain.entity.partida.ModoJuego;
import co.com.arena.real.domain.entity.partida.PartidaEnEspera;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Repository
public interface PartidaEnEsperaRepository extends JpaRepository<PartidaEnEspera, UUID> {

    @Query("SELECT p FROM PartidaEnEspera p WHERE p.modoJuego = :modo AND p.monto = :monto")
    List<PartidaEnEspera> findByModoJuegoAndMonto(@Param("modo") ModoJuego modoJuego,
                                                  @Param("monto") BigDecimal monto);

    void deleteByJugador(Jugador jugador);

}
