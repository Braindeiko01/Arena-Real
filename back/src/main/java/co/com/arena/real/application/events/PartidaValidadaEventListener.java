package co.com.arena.real.application.events;

import co.com.arena.real.application.service.MatchSseService;
import co.com.arena.real.websocket.MatchWsService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;

@Component
@RequiredArgsConstructor
public class PartidaValidadaEventListener {

    private final MatchSseService matchSseService;
    private final MatchWsService matchWsService;

    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void handlePartidaValidada(PartidaValidadaEvent event) {
        matchSseService.notifyMatchValidated(event.partida());
        matchSseService.notifyRematchAvailable(event.partida());
    }
}
