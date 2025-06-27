package co.com.arena.real.application.service;

import co.com.arena.real.domain.entity.matchmaking.MatchPenalty;
import co.com.arena.real.infrastructure.repository.MatchPenaltyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class MatchPenaltyService {

    private final MatchPenaltyRepository repository;

    private String normalizeId(String a, String b, boolean first) {
        return first ? (a.compareTo(b) <= 0 ? a : b) : (a.compareTo(b) <= 0 ? b : a);
    }

    @Transactional
    public void penalize(String jugadorAId, String jugadorBId) {
        String j1 = normalizeId(jugadorAId, jugadorBId, true);
        String j2 = normalizeId(jugadorAId, jugadorBId, false);
        LocalDateTime expira = LocalDateTime.now().plusHours(1);
        repository.findByJugador1IdAndJugador2Id(j1, j2)
                .ifPresentOrElse(p -> {
                    p.setExpiraEn(expira);
                    repository.save(p);
                }, () -> {
                    MatchPenalty p = MatchPenalty.builder()
                            .jugador1Id(j1)
                            .jugador2Id(j2)
                            .expiraEn(expira)
                            .build();
                    repository.save(p);
                });
    }

    public boolean isPenalized(String jugadorAId, String jugadorBId) {
        String j1 = normalizeId(jugadorAId, jugadorBId, true);
        String j2 = normalizeId(jugadorAId, jugadorBId, false);
        return repository.findByJugador1IdAndJugador2Id(j1, j2)
                .filter(p -> p.getExpiraEn().isAfter(LocalDateTime.now()))
                .isPresent();
    }
}
