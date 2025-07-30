package co.com.arena.real.application.controller;

import co.com.arena.real.application.service.MatchSseService;
import co.com.arena.real.application.service.SseService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import co.com.arena.real.application.service.TokenValidationService;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

@RestController
@RequestMapping("/sse")
@RequiredArgsConstructor
public class SseController {

    private final SseService sseService;
    private final MatchSseService matchSseService;
    private final TokenValidationService tokenValidationService;

    @GetMapping("/transacciones/{jugadorId}")
    public SseEmitter streamTransacciones(@PathVariable String jugadorId,
                                          @RequestParam String token) {
        validateToken(token, jugadorId);
        return sseService.subscribe(jugadorId);
    }

    @GetMapping("/matchmaking/{jugadorId}")
    public SseEmitter streamMatch(@PathVariable("jugadorId") String jugadorId,
                                  @RequestParam String token) {
        validateToken(token, jugadorId);
        return matchSseService.subscribe(jugadorId);
    }

    @GetMapping("/match")
    public SseEmitter streamMatchLegacy(@RequestParam("jugadorId") String jugadorId,
                                        @RequestParam String token) {
        validateToken(token, jugadorId);
        return matchSseService.subscribe(jugadorId);
    }

    private void validateToken(String token, String jugadorId) {
        var jwt = tokenValidationService.validate(token)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED));
        if (!jugadorId.equals(jwt.getSubject())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN);
        }
    }
}