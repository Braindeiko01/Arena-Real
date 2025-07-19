package co.com.arena.real.application.controller;

import co.com.arena.real.application.service.SseService;
import co.com.arena.real.infrastructure.dto.rq.SaldoUpdateRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class SaldoController {

    private final SseService sseService;
    @Value("${service.auth.token:}")
    private String serviceToken;

    @PostMapping("/actualizar-saldo")
    public ResponseEntity<Void> actualizarSaldo(
            @RequestHeader(value = "X-Service-Auth", required = false) String auth,
            @RequestBody SaldoUpdateRequest request) {
        if (serviceToken == null || !serviceToken.equals(auth)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        sseService.sendEvent(request.getUserId(), "saldo-actualizar", "");
        return ResponseEntity.ok().build();
    }
}
