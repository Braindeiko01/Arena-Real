package co.com.arena.real.application.service;

import co.com.arena.real.infrastructure.dto.rs.TransaccionResponse;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;

@Service
@RequiredArgsConstructor
public class SseService extends AbstractSseEmitterService {

    private static final Logger log = LoggerFactory.getLogger(SseService.class);

    public SseEmitter subscribe(String jugadorId) {
        return super.subscribe(jugadorId);
    }

    public void notificarTransaccionAprobada(TransaccionResponse dto) {
        String jugadorId = dto.getJugadorId();

        EmitterWrapper wrapper = emitters.get(jugadorId);
        if (wrapper == null) {
            return;
        }

        try {
            log.info("\uD83D\uDCE1 Enviando evento SSE 'transaccion-aprobada' al jugador {}", dto.getJugadorId());
            wrapper.emitter.send(SseEmitter.event()
                    .name("transaccion-aprobada")
                    .data(dto));
            wrapper.lastAccess = System.currentTimeMillis();
        } catch (IOException e) {
            log.error("\u274C Error al enviar evento SSE al jugador {}", dto.getJugadorId(), e);
            removeEmitter(jugadorId);
            wrapper.emitter.completeWithError(e);
        }
    }

    public void sendEvent(String jugadorId, String eventName, Object data) {
        EmitterWrapper wrapper = emitters.get(jugadorId);
        if (wrapper == null) {
            return;
        }

        try {
            wrapper.emitter.send(SseEmitter.event()
                    .name(eventName)
                    .data(data));
            wrapper.lastAccess = System.currentTimeMillis();
        } catch (IOException e) {
            removeEmitter(jugadorId);
            wrapper.emitter.completeWithError(e);
        }
    }
}
