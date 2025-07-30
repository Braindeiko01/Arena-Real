package co.com.arena.real.application.controller;

import co.com.arena.real.application.service.MatchSseService;
import co.com.arena.real.application.service.TokenValidationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.util.Optional;

@RestController
@RequestMapping("/sse/matchmaking")
@RequiredArgsConstructor
public class MatchmakingSseController {

    private final TokenValidationService tokenValidationService;
    private final MatchSseService matchSseService;

    @GetMapping("/{jugadorId}")
    public SseEmitter stream(@PathVariable String jugadorId,
                             @RequestParam("token") String token) {
        Optional<Jwt> jwt = tokenValidationService.validate(token);
        if (jwt.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Token inválido");
        }
        if (!jwt.get().getSubject().equals(jugadorId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "El ID no coincide con el token");
        }
        return matchSseService.subscribe(jugadorId);
    }
}
