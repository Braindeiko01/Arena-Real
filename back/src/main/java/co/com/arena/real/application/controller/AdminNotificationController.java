package co.com.arena.real.application.controller;

import co.com.arena.real.application.service.SseService;
import co.com.arena.real.infrastructure.dto.rs.TransaccionResponse;
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
@RequestMapping("/api/internal")
@RequiredArgsConstructor
public class AdminNotificationController {

    private final SseService sseService;

    @Value("${admin.secret.token:}")
    private String adminToken;

    @PostMapping("/notify-transaction-approved")
    public ResponseEntity<Void> notifyTransactionApproved(
            @RequestHeader(value = "X-Admin-Secret", required = false) String secret,
            @RequestBody TransaccionResponse dto) {
        if (adminToken == null || !adminToken.equals(secret)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        sseService.notificarTransaccionAprobada(dto);
        return ResponseEntity.ok().build();
    }
}
