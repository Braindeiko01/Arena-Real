package co.com.arena.real.application.controller;

import co.com.arena.real.application.service.JugadorService;
import co.com.arena.real.application.service.SseService;
import co.com.arena.real.infrastructure.dto.rq.SaldoUpdateRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api")
public class SaldoController {

    private final JugadorService jugadorService;
    private final SseService sseService;

    @PostMapping("/actualizar-saldo")
    public ResponseEntity<Void> actualizarSaldo(@RequestBody SaldoUpdateRequest request) {
        jugadorService.obtenerSaldo(request.getUserId())
                .ifPresent(saldo -> sseService.sendEvent(request.getUserId(), "saldo-actualizar", saldo));
        return ResponseEntity.ok().build();
    }
}
