package co.com.arena.real.application.controller;

import co.com.arena.real.application.service.MatchSseService;
import co.com.arena.real.application.service.SseService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

@RestController
@RequestMapping("/sse")
@RequiredArgsConstructor
public class SseController {

    private final SseService sseService;
    private final MatchSseService matchSseService;

    @GetMapping("/transacciones/{jugadorId}")
    public SseEmitter streamTransacciones(@PathVariable String jugadorId,
                                          Authentication authentication) {
        checkJugador(jugadorId, authentication);
        return sseService.subscribe(jugadorId);
    }

    @GetMapping("/matchmaking/{jugadorId}")
    public SseEmitter streamMatch(@PathVariable("jugadorId") String jugadorId,
                                  Authentication authentication) {
        checkJugador(jugadorId, authentication);
        return matchSseService.subscribe(jugadorId);
    }

    @GetMapping("/match")
    public SseEmitter streamMatchLegacy(@RequestParam("jugadorId") String jugadorId,
                                        Authentication authentication) {
        checkJugador(jugadorId, authentication);
        return matchSseService.subscribe(jugadorId);
    }

    private void checkJugador(String jugadorId, Authentication authentication) {
        if (authentication == null || !jugadorId.equals(authentication.getName())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN);
        }
    }
}