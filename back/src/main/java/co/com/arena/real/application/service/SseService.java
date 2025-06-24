package co.com.arena.real.application.service;

import co.com.arena.real.infrastructure.dto.rs.TransaccionResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CopyOnWriteArrayList;

@Service
@RequiredArgsConstructor
public class SseService {

    private final Map<String, List<SseEmitter>> emitters = new ConcurrentHashMap<>();

    public SseEmitter subscribe(String jugadorId) {
        SseEmitter emitter = new SseEmitter(Long.MAX_VALUE);

        emitter.onCompletion(() -> removeEmitter(jugadorId, emitter));
        emitter.onTimeout(() -> removeEmitter(jugadorId, emitter));
        emitter.onError(e -> removeEmitter(jugadorId, emitter));

        emitters.computeIfAbsent(jugadorId, k -> new CopyOnWriteArrayList<>()).add(emitter);
        return emitter;
    }

    public void notificarTransaccionAprobada(TransaccionResponse dto) {
        String jugadorId = dto.getJugadorId();

        List<SseEmitter> userEmitters = emitters.get(jugadorId);
        if (userEmitters == null) return;

        List<SseEmitter> muertos = new ArrayList<>();
        for (SseEmitter emitter : userEmitters) {
            try {
                emitter.send(SseEmitter.event()
                        .name("transaccion-aprobada")
                        .data(dto));
            } catch (IOException e) {
                muertos.add(emitter);
            }
        }
        userEmitters.removeAll(muertos);
    }

    private void removeEmitter(String jugadorId, SseEmitter emitter) {
        List<SseEmitter> userEmitters = emitters.get(jugadorId);
        if (userEmitters != null) {
            userEmitters.remove(emitter);
        }
    }
}
