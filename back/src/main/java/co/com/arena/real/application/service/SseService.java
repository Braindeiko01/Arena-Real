package co.com.arena.real.application.service;

import co.com.arena.real.infrastructure.dto.rs.TransaccionResponse;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.util.Map;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ConcurrentHashMap;

@Service
@RequiredArgsConstructor
public class SseService extends AbstractSseEmitterService {

    private static final Logger log = LoggerFactory.getLogger(SseService.class);

    private record LatestEvent(String name, Object data) {}

    private final Map<String, LatestEvent> latestEvents = new ConcurrentHashMap<>();

    @Override
    protected void onSubscribe(String jugadorId, EmitterWrapper wrapper) {
        LatestEvent last = latestEvents.remove(jugadorId); // directamente lo eliminamos al intentar enviar
        if (last != null) {
            CompletableFuture.runAsync(() -> {
                try {
                    wrapper.emitter.send(SseEmitter.event()
                            .name(last.name())
                            .data(last.data()));
                    wrapper.lastAccess = System.currentTimeMillis();
                } catch (IOException e) {
                    log.error("❌ Error al enviar evento pendiente en onSubscribe", e);
                    removeEmitter(jugadorId);
                    wrapper.emitter.completeWithError(e);
                    latestEvents.put(jugadorId, last); // lo volvemos a guardar si falló
                }
            });
        }
    }

    public SseEmitter subscribe(String jugadorId) {
        return super.subscribe(jugadorId);
    }

    public void notificarTransaccionAprobada(TransaccionResponse dto) {
        String jugadorId = dto.getJugadorId();
        LatestEvent latest = new LatestEvent("transaccion-aprobada", dto);

        EmitterWrapper wrapper = emitters.get(jugadorId);
        if (wrapper == null) {
            latestEvents.put(jugadorId, latest);
            return;
        }

        try {
            wrapper.emitter.send(SseEmitter.event()
                    .name("transaccion-aprobada")
                    .data(dto));
            wrapper.lastAccess = System.currentTimeMillis();
        } catch (IOException e) {
            log.error("❌ Error al enviar evento SSE al jugador {}", jugadorId, e);
            removeEmitter(jugadorId);
            wrapper.emitter.completeWithError(e);
            latestEvents.put(jugadorId, latest);
        }
    }

    public void sendEvent(String jugadorId, String eventName, Object data) {
        LatestEvent latest = new LatestEvent(eventName, data);

        EmitterWrapper wrapper = emitters.get(jugadorId);
        if (wrapper == null) {
            latestEvents.put(jugadorId, latest);
            return;
        }

        try {
            wrapper.emitter.send(SseEmitter.event()
                    .name(eventName)
                    .data(data));
            wrapper.lastAccess = System.currentTimeMillis();
        } catch (IOException e) {
            log.error("❌ Error al enviar evento SSE '{}'", eventName, e);
            removeEmitter(jugadorId);
            wrapper.emitter.completeWithError(e);
            latestEvents.put(jugadorId, latest);
        }
    }
}
