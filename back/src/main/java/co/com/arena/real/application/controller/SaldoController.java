package co.com.arena.real.application.controller;

import co.com.arena.real.application.service.SseService;
import co.com.arena.real.infrastructure.dto.rq.SaldoUpdateRequest;
import co.com.arena.real.infrastructure.repository.JugadorRepository;
import lombok.extern.slf4j.Slf4j;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class SaldoController {

    private final SseService sseService;
    private final JugadorRepository jugadorRepository;
    @Value("${service.auth.token:}")
    private String serviceToken;

    @PostMapping("/actualizar-saldo")
    public ResponseEntity<Void> actualizarSaldo(
            @RequestHeader(value = "X-Service-Auth", required = false) String auth,
            @RequestBody SaldoUpdateRequest request) {
        if (serviceToken == null || !serviceToken.equals(auth)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        var jugadorOpt = jugadorRepository.findById(request.getUserId());
        Object data = jugadorOpt.map(j -> j.getSaldo()).orElse("");
        log.info("\uD83D\uDCE4 Enviando evento de saldo actualizado al jugador {}", request.getUserId());
        sseService.sendEvent(request.getUserId(), "saldo-actualizar", data);
        return ResponseEntity.ok().build();
    }
}
