package co.com.arena.real.infrastructure.repository;

import co.com.arena.real.domain.entity.Jugador;
import co.com.arena.real.domain.entity.PushToken;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface PushTokenRepository extends JpaRepository<PushToken, UUID> {
    List<PushToken> findAllByJugador(Jugador jugador);
    Optional<PushToken> findByToken(String token);
}
