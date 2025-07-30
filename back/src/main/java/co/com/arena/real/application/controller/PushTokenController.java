package co.com.arena.real.application.controller;

import co.com.arena.real.application.service.PushNotificationService;
import co.com.arena.real.application.service.TokenValidationService;
import co.com.arena.real.infrastructure.dto.rq.PushTokenRequest;
import co.com.arena.real.infrastructure.repository.JugadorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/push")
@RequiredArgsConstructor
@ConditionalOnProperty(prefix = "firebase", name = "enabled", havingValue = "true")
public class PushTokenController {

    private final ObjectProvider<PushNotificationService> pushNotificationService;
    private final JugadorRepository jugadorRepository;
    private final TokenValidationService tokenValidationService;

    @PostMapping("/register")
    public ResponseEntity<Void> register(
            @RequestBody PushTokenRequest request,
            @RequestHeader(value = "Authorization", required = false) String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        String token = authHeader.substring(7);
        java.util.Optional<org.springframework.security.oauth2.jwt.Jwt> jwt = tokenValidationService.validate(token);

        if (jwt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        String subject = jwt.get().getSubject();
        if (!subject.equals(request.getJugadorId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        return jugadorRepository.findById(request.getJugadorId())
                .map(jugador -> {
                    PushNotificationService svc = pushNotificationService.getIfAvailable();
                    if (svc != null) {
                        svc.registerToken(jugador, request.getToken());
                    }
                    return ResponseEntity.ok().<Void>build();
                })
                .orElseGet(() -> ResponseEntity.notFound().<Void>build());
    }
}
