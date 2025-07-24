package co.com.arena.real.application.service;

import co.com.arena.real.application.events.TransaccionAprobadaEvent;
import co.com.arena.real.domain.entity.EstadoTransaccion;
import co.com.arena.real.domain.entity.Jugador;
import co.com.arena.real.domain.entity.Transaccion;
import co.com.arena.real.infrastructure.dto.rq.TransaccionRequest;
import co.com.arena.real.infrastructure.dto.rs.TransaccionResponse;
import co.com.arena.real.infrastructure.mapper.TransaccionMapper;
import co.com.arena.real.infrastructure.repository.JugadorRepository;
import co.com.arena.real.infrastructure.repository.TransaccionRepository;
import co.com.arena.real.application.service.SaldoService;
import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class TransaccionService {

    private final TransaccionRepository transaccionRepository;
    private final TransaccionMapper transaccionMapper;
    private final JugadorRepository jugadorRepository;
    private final ApplicationEventPublisher eventPublisher;
    private final SaldoService saldoService;

    public TransaccionResponse registrarTransaccion(TransaccionRequest dto) {
        Jugador jugador = jugadorRepository.findById(dto.getJugadorId())
                .orElseThrow(() -> new IllegalArgumentException("Jugador no encontrado"));

        Transaccion transaccion = transaccionMapper.toEntity(dto);
        transaccion.setJugador(jugador);
        transaccion.setEstado(EstadoTransaccion.PENDIENTE);
        transaccion.setCreadoEn(LocalDateTime.now());

        Transaccion saved = transaccionRepository.save(transaccion);
        return transaccionMapper.toDto(saved);
    }

    public List<TransaccionResponse> listarPorJugador(String jugadorId) {
        return transaccionRepository.findByJugador_Id(jugadorId).stream()
                .map(transaccionMapper::toDto)
                .toList();
    }

    @Transactional
    public TransaccionResponse aprobarTransaccion(UUID id) {
        Transaccion transaccion = transaccionRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Transaccion no encontrada"));

        if (EstadoTransaccion.APROBADA.equals(transaccion.getEstado())) {
            throw new IllegalArgumentException("La transaccion ya ha sido aprobada con anterioridad");
        }

        modificarSaldoJugador(transaccion);

        transaccion.setEstado(EstadoTransaccion.APROBADA);
        Transaccion saved = transaccionRepository.save(transaccion);

        TransaccionResponse dto = transaccionMapper.toDto(saved);
        eventPublisher.publishEvent(new TransaccionAprobadaEvent(dto));
        return dto;
    }

    private void modificarSaldoJugador(Transaccion transaccion) {
        switch (transaccion.getTipo()) {
            case DEPOSITO, PREMIO, REEMBOLSO ->
                    saldoService.acreditarSaldo(transaccion.getJugador().getId(), transaccion.getMonto());
            case RETIRO, APUESTA ->
                    saldoService.debitarSaldo(transaccion.getJugador().getId(), transaccion.getMonto());
        }
    }
}
