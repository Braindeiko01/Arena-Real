package co.com.arena.real.application.controller;

import co.com.arena.real.application.service.MatchSseService;
import co.com.arena.real.application.service.SseService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtException;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

@RestController
@RequestMapping("/sse")
@RequiredArgsConstructor
public class SseController {

    private final SseService sseService;
    private final MatchSseService matchSseService;
    private final JwtDecoder jwtDecoder;

    @GetMapping("/transacciones/{jugadorId}")
    public SseEmitter streamTransacciones(@PathVariable String jugadorId,
                                          @RequestParam String token) {
        validateScope(token);
        return sseService.subscribe(jugadorId);
    }

    @GetMapping("/matchmaking/{jugadorId}")
    public SseEmitter streamMatch(@PathVariable("jugadorId") String jugadorId,
                                  @RequestParam String token) {
        validateScope(token);
        return matchSseService.subscribe(jugadorId);
    }

    @GetMapping("/match")
    public SseEmitter streamMatchLegacy(@RequestParam("jugadorId") String jugadorId,
                                        @RequestParam String token) {
        validateScope(token);
        return matchSseService.subscribe(jugadorId);
    }

    private void validateScope(String token) {
        try {
            Jwt jwt = jwtDecoder.decode(token);
            String scope = jwt.getClaimAsString("scope");
            if (!"USER".equals(scope) && !"ADMIN".equals(scope)) {
                throw new ResponseStatusException(HttpStatus.UNAUTHORIZED);
            }
        } catch (JwtException e) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED);
        }
    }
}