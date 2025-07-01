package co.com.arena.real.application.service;

import co.com.arena.real.domain.entity.matchmaking.MatchDecline;
import co.com.arena.real.infrastructure.repository.MatchDeclineRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class MatchDeclineService {

    private final MatchDeclineRepository repository;

    private String normalizeId(String a, String b, boolean first) {
        return first ? (a.compareTo(b) <= 0 ? a : b) : (a.compareTo(b) <= 0 ? b : a);
    }

    @Transactional
    public void recordDecline(String jugadorAId, String jugadorBId) {
        String j1 = normalizeId(jugadorAId, jugadorBId, true);
        String j2 = normalizeId(jugadorAId, jugadorBId, false);
        LocalDateTime expira = LocalDateTime.now().plusHours(1);
        repository.findByJugador1IdAndJugador2Id(j1, j2)
                .ifPresentOrElse(p -> {
                    p.setExpiraEn(expira);
                    repository.save(p);
                }, () -> {
                    try {
                        MatchDecline p = MatchDecline.builder()
                                .jugador1Id(j1)
                                .jugador2Id(j2)
                                .expiraEn(expira)
                                .build();
                        repository.save(p);
                    } catch (DataIntegrityViolationException e) {
                        repository.findByJugador1IdAndJugador2Id(j1, j2)
                                .ifPresent(existing -> {
                                    existing.setExpiraEn(expira);
                                    repository.save(existing);
                                });
                    }
                });
    }

    public boolean isDeclined(String jugadorAId, String jugadorBId) {
        String j1 = normalizeId(jugadorAId, jugadorBId, true);
        String j2 = normalizeId(jugadorAId, jugadorBId, false);
        return repository.findByJugador1IdAndJugador2Id(j1, j2)
                .filter(p -> p.getExpiraEn().isAfter(LocalDateTime.now()))
                .isPresent();
    }

    @Scheduled(fixedRate = 5 * 60 * 1000)
    public void limpiarDeclinacionesExpiradas() {
        repository.deleteAllByExpiraEnBefore(LocalDateTime.now());
    }
}
