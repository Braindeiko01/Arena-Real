package co.com.arena.real.application.service;

import co.com.arena.real.domain.entity.Jugador;
import co.com.arena.real.domain.entity.partida.Partida;
import co.com.arena.real.domain.entity.referral.ReferralReward;
import co.com.arena.real.infrastructure.repository.JugadorRepository;
import co.com.arena.real.infrastructure.repository.ReferralRewardRepository;
import co.com.arena.real.application.service.SaldoService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ReferralRewardService {

    private static final BigDecimal REWARD_AMOUNT = BigDecimal.valueOf(1000);

    private final ReferralRewardRepository rewardRepository;
    private final JugadorRepository jugadorRepository;
    private final SaldoService saldoService;

    @Transactional
    public void processPartida(Partida partida) {
        creditForPlayer(partida.getJugador1(), partida);
        creditForPlayer(partida.getJugador2(), partida);
    }

    private void creditForPlayer(Jugador jugador, Partida partida) {
        if (jugador == null || jugador.getReferredBy() == null) {
            return;
        }
        jugadorRepository.findById(jugador.getReferredBy()).filter(Jugador::isHasPlayed).ifPresent(inviter -> {
            ReferralReward reward = ReferralReward.builder()
                    .inviter(inviter)
                    .referred(jugador)
                    .partida(partida)
                    .amount(REWARD_AMOUNT)
                    .creditedAt(LocalDateTime.now())
                    .build();
            rewardRepository.save(reward);
            saldoService.acreditarSaldo(inviter.getId(), REWARD_AMOUNT);
        });
        if (!jugador.isHasPlayed()) {
            jugador.setHasPlayed(true);
            jugadorRepository.save(jugador);
        }
    }

    public BigDecimal earningsForUser(String jugadorId) {
        return rewardRepository.totalEarnedByInviter(jugadorId);
    }

    @Transactional(readOnly = true)
    public List<ReferralReward> rewardsForUser(String jugadorId) {
        return rewardRepository.findByInviter_Id(jugadorId);
    }
}
