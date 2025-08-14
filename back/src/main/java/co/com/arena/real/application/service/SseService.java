package co.com.arena.real.application.service;

import co.com.arena.real.infrastructure.dto.rs.TransaccionResponse;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.util.ArrayDeque;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;

@Service
@RequiredArgsConstructor
public class SseService extends AbstractSseEmitterService {

    private static final Logger log = LoggerFactory.getLogger(SseService.class);

    private record LatestEvent(String name, Object data) {}
    private static final int BUFFER_CAPACITY = 50;

    private static final class Ev {
        final long id;
        final String name;
        final Object data;
        final long ts;

        Ev(long id, String name, Object data) {
            this.id = id;
            this.name = name;
            this.data = data;
            this.ts = System.currentTimeMillis();
        }
    }

    // Un emisor por jugador (heredado de AbstractSseEmitterService)
    // protected final Map<String, EmitterWrapper> emitters = ...

    // Secuencia por jugador (para IDs)
    private final Map<String, AtomicLong> seqByUser = new ConcurrentHashMap<>();
    // Buffer acotado por jugador para replay con Last-Event-ID
    private final Map<String, ArrayDeque<Ev>> buffers = new ConcurrentHashMap<>();
    // Últimos por tipo (snapshot consistente)
    private final Map<String, Map<String, LatestEvent>> latestByType = new ConcurrentHashMap<>();

    @Override
    protected void onSubscribe(String jugadorId, EmitterWrapper wrapper) {
        try {
            wrapper.emitter.send(SseEmitter.event().name("connected").data("ok").reconnectTime(3000));
            wrapper.lastAccess = System.currentTimeMillis();
        } catch (Exception ignored) {
        }
        // El replay real lo dispara el controlador llamando a replayOnSubscribe(...)
    }

    public SseEmitter subscribe(String jugadorId) {
        // Asegúrate de que AbstractSseEmitterService registre onTimeout/onError/onCompletion -> removeEmitter(jugadorId)
        return super.subscribe(jugadorId);
    }

    /** Reproduce eventos pendientes al suscribirse/reconectarse */
    public void replayOnSubscribe(String jugadorId, String lastEventIdStr) {
        EmitterWrapper wrapper = emitters.get(jugadorId);
        if (wrapper == null) {
            return;
        }

        Long lastId = null;
        try {
            if (lastEventIdStr != null) {
                lastId = Long.parseLong(lastEventIdStr.trim());
            }
        } catch (NumberFormatException ignored) {
        }

        if (lastId != null) {
            ArrayDeque<Ev> dq = buffers.get(jugadorId);
            if (dq != null && !dq.isEmpty()) {
                synchronized (dq) {
                    for (Ev ev : dq) {
                        if (ev.id > lastId) {
                            trySend(wrapper, jugadorId, ev);
                        }
                    }
                }
                return;
            }
        }

        Map<String, LatestEvent> map = latestByType.get(jugadorId);
        if (map != null) {
            for (LatestEvent le : map.values()) {
                long id = nextId(jugadorId);
                trySend(wrapper, jugadorId, new Ev(id, le.name(), le.data()));
            }
        }
    }

    /** Atajo específico de dominio */
    public void notificarTransaccionAprobada(TransaccionResponse dto) {
        sendEvent(dto.getJugadorId(), "transaccion-aprobada", dto);
    }

    /** Enviar evento (o encolar si el usuario aún no está suscrito) */
    public void sendEvent(String jugadorId, String eventName, Object data) {
        long id = nextId(jugadorId);
        Ev ev = new Ev(id, eventName, data);

        // Actualizar snapshot por tipo
        latestByType.computeIfAbsent(jugadorId, k -> new ConcurrentHashMap<>())
                .put(eventName, new LatestEvent(eventName, data));

        // Encolar en buffer acotado
        ArrayDeque<Ev> dq = buffers.computeIfAbsent(jugadorId, k -> new ArrayDeque<>(BUFFER_CAPACITY));
        synchronized (dq) {
            if (dq.size() == BUFFER_CAPACITY) {
                dq.removeFirst();
            }
            dq.addLast(ev);
        }

        EmitterWrapper wrapper = emitters.get(jugadorId);
        if (wrapper == null) {
            return;
        }

        trySend(wrapper, jugadorId, ev);
    }

    private void trySend(EmitterWrapper wrapper, String jugadorId, Ev ev) {
        try {
            wrapper.emitter.send(SseEmitter.event()
                    .id(Long.toString(ev.id))
                    .name(ev.name)
                    .data(ev.data)
                    .reconnectTime(3000));
            wrapper.lastAccess = System.currentTimeMillis();
        } catch (Exception e) {
            log.error("❌ Error SSE a jugador {} (evento '{}')", jugadorId, ev.name, e);
            removeEmitter(jugadorId);
            try {
                wrapper.emitter.completeWithError(e);
            } catch (Exception ignored) {
            }
        }
    }

    private long nextId(String jugadorId) {
        return seqByUser.computeIfAbsent(jugadorId, k -> new AtomicLong(0)).incrementAndGet();
    }
}

