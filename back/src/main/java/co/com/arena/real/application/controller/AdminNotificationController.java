package co.com.arena.real.application.controller;

import co.com.arena.real.application.service.SseService;
import co.com.arena.real.application.service.JugadorService;
import co.com.arena.real.infrastructure.dto.rs.TransaccionResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtException;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.security.access.prepost.PreAuthorize;

@Slf4j
@RestController
@RequestMapping("/api/internal")
public class AdminNotificationController {

    private final SseService sseService;
    private final JugadorService jugadorService;
    private final @Qualifier("hs256JwtDecoder") JwtDecoder jwtDecoder;

    public AdminNotificationController(SseService sseService,
            JugadorService jugadorService,
            @Qualifier("hs256JwtDecoder") JwtDecoder jwtDecoder) {
        this.sseService = sseService;
        this.jugadorService = jugadorService;
        this.jwtDecoder = jwtDecoder;
    }

    @PostMapping("/notify-transaction-approved")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> notifyTransactionApproved(
            @RequestHeader(value = HttpHeaders.AUTHORIZATION, required = false) String authorization,
            @RequestBody TransaccionResponse dto) {
        if (!isValidAdminToken(authorization)) {
            log.warn("\uD83D\uDD12 Token admin inválido recibido en notificación de transacción.");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        log.info("\uD83D\uDCE5 Backend recibió notificación de transacción aprobada. Transacción ID: {}, Jugador ID: {}", dto.getId(), dto.getJugadorId());
        sseService.notificarTransaccionAprobada(dto);
        jugadorService.obtenerSaldo(dto.getJugadorId())
                .ifPresent(saldo -> sseService.sendEvent(dto.getJugadorId(), "saldo-actualizar", saldo));
        return ResponseEntity.ok().build();
    }

    @PostMapping("/notify-prize-distributed")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> notifyPrizeDistributed(
            @RequestHeader(value = HttpHeaders.AUTHORIZATION, required = false) String authorization,
            @RequestBody TransaccionResponse dto) {
        if (!isValidAdminToken(authorization)) {
            log.warn("\uD83D\uDD12 Token admin inválido recibido en notificación de premio.");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        log.info("\uD83C\uDFC6 Backend recibió notificación de premio. Transacción ID: {}, Jugador ID: {}",
                dto.getId(), dto.getJugadorId());
        sseService.notificarTransaccionAprobada(dto);
        jugadorService.obtenerSaldo(dto.getJugadorId())
                .ifPresent(saldo -> sseService.sendEvent(dto.getJugadorId(), "saldo-actualizar", saldo));
        return ResponseEntity.ok().build();
    }

    private boolean isValidAdminToken(String authorization) {
        if (authorization == null || !authorization.startsWith("Bearer ")) {
            return false;
        }
        String token = authorization.substring(7);
        try {
            Jwt jwt = jwtDecoder.decode(token);
            String scope = jwt.getClaimAsString("scope");
            return "ADMIN".equals(scope);
        } catch (JwtException e) {
            log.warn("Invalid admin JWT", e);
            return false;
        }
    }
}
