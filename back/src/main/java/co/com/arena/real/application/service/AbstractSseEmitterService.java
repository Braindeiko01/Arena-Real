package co.com.arena.real.application.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

public abstract class AbstractSseEmitterService {

    protected static class EmitterWrapper {
        final SseEmitter emitter;
        volatile long lastAccess;

        EmitterWrapper(SseEmitter emitter) {
            this.emitter = emitter;
            this.lastAccess = System.currentTimeMillis();
        }
    }

    private static final long TTL_MS = 5 * 60 * 1000L;

    protected final Map<String, EmitterWrapper> emitters = new ConcurrentHashMap<>();
    private final Logger log = LoggerFactory.getLogger(getClass());

    protected SseEmitter subscribe(String jugadorId) {
        String lock = ("lock_" + jugadorId).intern();
        synchronized (lock) {
            EmitterWrapper existing = emitters.remove(jugadorId);
            if (existing != null) {
                existing.emitter.complete();
            }

            SseEmitter emitter = new SseEmitter(Long.MAX_VALUE);
            EmitterWrapper wrapper = new EmitterWrapper(emitter);

            emitter.onCompletion(() -> removeEmitter(jugadorId));
            emitter.onTimeout(() -> removeEmitter(jugadorId));
            emitter.onError(ex -> removeEmitter(jugadorId));

            emitters.put(jugadorId, wrapper);
            log.info("Nueva conexión SSE para jugador: {}", jugadorId);

            onSubscribe(jugadorId, wrapper);
            return emitter;
        }
    }

    @Scheduled(fixedRate = 15000)
    public void sendHeartbeats() {
        emitters.forEach((id, wrapper) -> {
            try {
                wrapper.emitter.send(SseEmitter.event().comment("heartbeat"));
                wrapper.lastAccess = System.currentTimeMillis();
            } catch (IOException e) {
                removeEmitter(id);
            }
        });
    }

    @Scheduled(fixedRate = 60000)
    public void cleanupEmitters() {
        long now = System.currentTimeMillis();
        emitters.forEach((id, wrapper) -> {
            if (now - wrapper.lastAccess > TTL_MS) {
                removeEmitter(id);
                wrapper.emitter.complete();
            }
        });
    }

    protected void removeEmitter(String jugadorId) {
        emitters.remove(jugadorId);
        log.info("Desconectado SSE jugador: {}", jugadorId);
    }

    protected void onSubscribe(String jugadorId, EmitterWrapper wrapper) {
        // for subclasses to override
    }
}
