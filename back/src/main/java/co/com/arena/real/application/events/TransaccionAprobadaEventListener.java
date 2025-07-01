package co.com.arena.real.application.events;

import co.com.arena.real.application.service.SseService;
import lombok.RequiredArgsConstructor;
import org.springframework.transaction.event.TransactionalEventListener;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class TransaccionAprobadaEventListener {

    private final SseService sseService;

    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void handleTransaccionAprobada(TransaccionAprobadaEvent event) {
        sseService.notificarTransaccionAprobada(event.transaccion());
    }
}
