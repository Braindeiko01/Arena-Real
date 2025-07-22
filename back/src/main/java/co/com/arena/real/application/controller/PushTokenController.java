package co.com.arena.real.application.controller;

import co.com.arena.real.application.service.PushNotificationService;
import co.com.arena.real.infrastructure.dto.rq.PushTokenRequest;
import co.com.arena.real.infrastructure.repository.JugadorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.autoconfigure.condition.ConditionalOnBean;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/push")
@RequiredArgsConstructor
@ConditionalOnBean(PushNotificationService.class)
@ConditionalOnProperty(prefix = "firebase", name = "enabled", havingValue = "true")
public class PushTokenController {

    private final PushNotificationService pushNotificationService;
    private final JugadorRepository jugadorRepository;

    @PostMapping("/register")
    public ResponseEntity<Void> register(@RequestBody PushTokenRequest request) {
        return jugadorRepository.findById(request.getJugadorId())
                .map(jugador -> {
                    pushNotificationService.registerToken(jugador, request.getToken());
                    return ResponseEntity.ok().<Void>build();
                })
                .orElseGet(() -> ResponseEntity.notFound().<Void>build());
    }
}
