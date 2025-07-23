package co.com.arena.real.application.controller;

import co.com.arena.real.application.service.SseService;
import co.com.arena.real.infrastructure.dto.rs.TransaccionResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
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
@RequestMapping("/api/internal")
@RequiredArgsConstructor
public class AdminNotificationController {

    private final SseService sseService;

    @Value("${admin.secret.token:}")
    private String adminToken;

    @PostMapping("/notify-transaction-approved")
    public ResponseEntity<Void> notifyTransactionApproved(
            @RequestHeader(value = "X-Admin-Secret", required = false) String secret, //todo: cambiar a JWT para autenticarse
            @RequestBody TransaccionResponse dto) {
        if (adminToken == null || !adminToken.equals(secret)) {
            log.warn("\uD83D\uDD12 Token admin inválido recibido en notificación de transacción.");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        log.info("\uD83D\uDCE5 Backend recibió notificación de transacción aprobada. Transacción ID: {}, Jugador ID: {}", dto.getId(), dto.getJugadorId());
        sseService.notificarTransaccionAprobada(dto);
        return ResponseEntity.ok().build();
    }
}
