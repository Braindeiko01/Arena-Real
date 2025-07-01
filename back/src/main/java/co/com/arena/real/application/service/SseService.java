package co.com.arena.real.application.service;

import co.com.arena.real.infrastructure.dto.rs.TransaccionResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
@RequiredArgsConstructor
public class SseService {

    private static class EmitterWrapper {
        final SseEmitter emitter;
        volatile long lastAccess;

        EmitterWrapper(SseEmitter emitter) {
            this.emitter = emitter;
            this.lastAccess = System.currentTimeMillis();
        }
    }

    private final Map<String, EmitterWrapper> emitters = new ConcurrentHashMap<>();

    public SseEmitter subscribe(String jugadorId) {
        EmitterWrapper existing = emitters.remove(jugadorId);
        if (existing != null) {
            existing.emitter.complete();
        }

        SseEmitter emitter = new SseEmitter(Long.MAX_VALUE);

        emitter.onCompletion(() -> removeEmitter(jugadorId));
        emitter.onTimeout(() -> removeEmitter(jugadorId));
        emitter.onError(e -> removeEmitter(jugadorId));

        emitters.put(jugadorId, new EmitterWrapper(emitter));
        return emitter;
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
    public void limpiarEmitters() {
        long now = System.currentTimeMillis();
        long ttl = 5 * 60 * 1000L;
        emitters.forEach((id, wrapper) -> {
            if (now - wrapper.lastAccess > ttl) {
                removeEmitter(id);
                wrapper.emitter.complete();
            }
        });
    }

    public void notificarTransaccionAprobada(TransaccionResponse dto) {
        String jugadorId = dto.getJugadorId();

        EmitterWrapper wrapper = emitters.get(jugadorId);
        if (wrapper == null) {
            return;
        }

        try {
            wrapper.emitter.send(SseEmitter.event()
                    .name("transaccion-aprobada")
                    .data(dto));
            wrapper.lastAccess = System.currentTimeMillis();
        } catch (IOException e) {
            removeEmitter(jugadorId);
            wrapper.emitter.completeWithError(e);
        }
    }

    private void removeEmitter(String jugadorId) {
        emitters.remove(jugadorId);
    }
}
