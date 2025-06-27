package co.com.arena.real.infrastructure.repository;

import co.com.arena.real.domain.entity.matchmaking.MatchPenalty;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface MatchPenaltyRepository extends JpaRepository<MatchPenalty, UUID> {
    Optional<MatchPenalty> findByJugador1IdAndJugador2Id(String jugador1Id, String jugador2Id);
}
