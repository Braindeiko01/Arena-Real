package co.com.arena.real.application.service;

import co.com.arena.real.application.events.SaldoActualizadoEvent;
import co.com.arena.real.application.events.TransaccionAprobadaEvent;
import co.com.arena.real.domain.entity.EstadoTransaccion;
import co.com.arena.real.domain.entity.Jugador;
import co.com.arena.real.domain.entity.TipoTransaccion;
import co.com.arena.real.domain.entity.Transaccion;
import co.com.arena.real.infrastructure.dto.rs.TransaccionResponse;
import co.com.arena.real.infrastructure.mapper.TransaccionMapper;
import co.com.arena.real.infrastructure.repository.JugadorRepository;
import co.com.arena.real.infrastructure.repository.TransaccionRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.ApplicationEventPublisher;

import java.math.BigDecimal;
import java.util.Optional;
import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.isA;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@SpringBootTest(classes = TransaccionService.class)
class TransaccionServiceTest {

    @MockBean
    private TransaccionRepository transaccionRepository;
    @MockBean
    private TransaccionMapper transaccionMapper;
    @MockBean
    private JugadorRepository jugadorRepository;
    @MockBean
    private ApplicationEventPublisher eventPublisher;
    @MockBean
    private SaldoService saldoService;

    @Autowired
    private TransaccionService service;

    @Test
    void aprobarTransaccionPublicaEventos() {
        UUID id = UUID.randomUUID();
        Jugador jugador = Jugador.builder().id("jugador1").saldo(BigDecimal.ZERO).build();
        Transaccion transaccion = Transaccion.builder()
                .id(id)
                .jugador(jugador)
                .monto(BigDecimal.TEN)
                .tipo(TipoTransaccion.DEPOSITO)
                .estado(EstadoTransaccion.PENDIENTE)
                .build();
        TransaccionResponse dto = TransaccionResponse.builder()
                .id(id)
                .jugadorId(jugador.getId())
                .monto(BigDecimal.TEN)
                .tipo(TipoTransaccion.DEPOSITO)
                .estado(EstadoTransaccion.APROBADA)
                .build();

        when(transaccionRepository.findById(id)).thenReturn(Optional.of(transaccion));
        when(transaccionRepository.save(any(Transaccion.class))).thenAnswer(inv -> inv.getArgument(0));
        when(transaccionMapper.toDto(any(Transaccion.class))).thenReturn(dto);

        service.aprobarTransaccion(id);

        verify(eventPublisher).publishEvent(isA(TransaccionAprobadaEvent.class));
        verify(eventPublisher).publishEvent(isA(SaldoActualizadoEvent.class));
    }
}
