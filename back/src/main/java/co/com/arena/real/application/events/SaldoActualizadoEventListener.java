package co.com.arena.real.application.events;

import co.com.arena.real.application.service.SseService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionalEventListener;
import org.springframework.transaction.event.TransactionPhase;

@Component
@RequiredArgsConstructor
public class SaldoActualizadoEventListener {

    private final SseService sseService;

    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void handleSaldoActualizado(SaldoActualizadoEvent event) {
        sseService.sendEvent(event.jugadorId(), "saldo-actualizar", event.saldo());
    }
}
