package co.com.arena.real.infrastructure.repository;

import co.com.arena.real.domain.entity.matchmaking.MatchProposal;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import jakarta.persistence.LockModeType;
import java.util.Optional;

import java.util.UUID;

public interface MatchProposalRepository extends JpaRepository<MatchProposal, UUID> {

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT p FROM MatchProposal p WHERE p.id = :id")
    Optional<MatchProposal> findByIdForUpdate(@Param("id") UUID id);
}
