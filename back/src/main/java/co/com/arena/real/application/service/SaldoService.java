package co.com.arena.real.application.service;

import co.com.arena.real.application.events.SaldoActualizadoEvent;
import co.com.arena.real.domain.entity.Jugador;
import co.com.arena.real.infrastructure.repository.JugadorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

@Service
@RequiredArgsConstructor
public class SaldoService {

    private final JugadorRepository jugadorRepository;
    private final ApplicationEventPublisher eventPublisher;

    @Transactional
    public void acreditarSaldo(String jugadorId, BigDecimal monto) {
        Jugador jugador = jugadorRepository.findById(jugadorId)
                .orElseThrow(() -> new IllegalArgumentException("Jugador no encontrado"));
        jugador.setSaldo(jugador.getSaldo().add(monto));
        Jugador saved = jugadorRepository.save(jugador);
        eventPublisher.publishEvent(new SaldoActualizadoEvent(jugadorId, saved.getSaldo()));
    }

    @Transactional
    public void debitarSaldo(String jugadorId, BigDecimal monto) {
        Jugador jugador = jugadorRepository.findById(jugadorId)
                .orElseThrow(() -> new IllegalArgumentException("Jugador no encontrado"));
        if (jugador.getSaldo().compareTo(monto) < 0) {
            throw new IllegalArgumentException("Saldo insuficiente para realizar la transacción");
        }
        jugador.setSaldo(jugador.getSaldo().subtract(monto));
        Jugador saved = jugadorRepository.save(jugador);
        eventPublisher.publishEvent(new SaldoActualizadoEvent(jugadorId, saved.getSaldo()));
    }
}
