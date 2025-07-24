package co.com.arena.real.application.events;

import co.com.arena.real.application.service.TransaccionSseService;
import lombok.RequiredArgsConstructor;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class TransaccionAprobadaEventListener {

    private final TransaccionSseService transaccionSseService;

    @EventListener
    public void handleTransaccionAprobada(TransaccionAprobadaEvent event) {
        transaccionSseService.sendTransaccionAprobada(event.transaccion());
    }
}
