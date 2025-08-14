package co.com.arena.real.application.controller;

import co.com.arena.real.application.service.MatchSseService;
import co.com.arena.real.application.service.SseService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

@RestController
@RequestMapping("/sse")
@RequiredArgsConstructor
public class SseController {

    private final SseService sseService;
    private final MatchSseService matchSseService;

    @GetMapping(path = "/transacciones/{jugadorId}", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter streamTransacciones(
            @PathVariable String jugadorId,
            @RequestHeader(value = "Last-Event-ID", required = false) String lastEventId) {
        SseEmitter emitter = sseService.subscribe(jugadorId);
        sseService.replayOnSubscribe(jugadorId, lastEventId);
        return emitter;
    }

    @GetMapping("/matchmaking/{jugadorId}")
    public SseEmitter streamMatch(@PathVariable("jugadorId") String jugadorId) {
        return matchSseService.subscribe(jugadorId);
    }

    @GetMapping("/match")
    public SseEmitter streamMatchLegacy(@RequestParam("jugadorId") String jugadorId) {
        return matchSseService.subscribe(jugadorId);
    }
}