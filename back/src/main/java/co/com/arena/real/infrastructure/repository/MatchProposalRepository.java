package co.com.arena.real.infrastructure.repository;

import co.com.arena.real.domain.entity.matchmaking.MatchProposal;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface MatchProposalRepository extends JpaRepository<MatchProposal, UUID> {
}
