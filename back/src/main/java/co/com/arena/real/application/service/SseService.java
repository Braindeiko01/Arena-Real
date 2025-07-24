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

    private final Map<String, SseEmitter> emitters = new ConcurrentHashMap<>();

    public SseEmitter subscribe(String jugadorId) {
        SseEmitter existing = emitters.remove(jugadorId);
        if (existing != null) {
            existing.complete();
        }

        SseEmitter emitter = new SseEmitter(Long.MAX_VALUE);

        emitter.onCompletion(() -> removeEmitter(jugadorId));
        emitter.onTimeout(() -> removeEmitter(jugadorId));
        emitter.onError(e -> removeEmitter(jugadorId));

        emitters.put(jugadorId, emitter);
        return emitter;
    }

    @Scheduled(fixedRate = 15000)
    public void sendHeartbeats() {
        emitters.forEach((id, emitter) -> {
            try {
                emitter.send(SseEmitter.event().comment("heartbeat"));
            } catch (IOException e) {
                removeEmitter(id);
            }
        });
    }

    public void notificarTransaccionAprobada(TransaccionResponse dto) {
        String jugadorId = dto.getJugadorId();

        SseEmitter emitter = emitters.get(jugadorId);
        if (emitter == null) {
            return;
        }

        try {
            emitter.send(SseEmitter.event()
                    .name("transaccion-aprobada")
                    .data(dto));
        } catch (IOException e) {
            removeEmitter(jugadorId);
            emitter.completeWithError(e);
        }
    }

    private void removeEmitter(String jugadorId) {
        emitters.remove(jugadorId);
    }
}
