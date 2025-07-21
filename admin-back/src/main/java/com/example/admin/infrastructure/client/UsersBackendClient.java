package com.example.admin.infrastructure.client;

import com.example.admin.infrastructure.dto.SaldoUpdateRequest;
import co.com.arena.real.infrastructure.dto.rs.TransaccionResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.retry.support.RetryTemplate;
import org.springframework.stereotype.Service;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.web.client.RestTemplate;

@Slf4j
@Service
@RequiredArgsConstructor
public class UsersBackendClient {

    private final RestTemplate restTemplate;
    private final RetryTemplate retryTemplate;

    @Value("${users.backend.url:http://localhost:8080}")
    private String backendUrl;

    @Value("${users.backend.token:}")
    private String backendToken;

    public void notifySaldoUpdate(String userId) {
        SaldoUpdateRequest request = new SaldoUpdateRequest();
        request.setUserId(userId);
        String url = backendUrl + "/api/actualizar-saldo";

        HttpHeaders headers = new HttpHeaders();
        headers.set("X-Service-Auth", backendToken);
        HttpEntity<SaldoUpdateRequest> entity = new HttpEntity<>(request, headers);

        try {
            retryTemplate.execute(ctx -> {
                log.info("\uD83D\uDD04 Enviando actualizaci\u00f3n de saldo al backend: {} -> {}", userId, url);
                restTemplate.exchange(url, HttpMethod.POST, entity, Void.class);
                log.info("\u2705 Actualizaci\u00f3n de saldo enviada correctamente para jugador {}", userId);
                return null;
            });
        } catch (Exception e) {
            log.error("\u274C Error al notificar actualizaci\u00f3n de saldo", e);
        }
    }

    public void notifyTransactionApproved(TransaccionResponse dto) {
        String url = backendUrl + "/api/internal/notify-transaction-approved";

        HttpHeaders headers = new HttpHeaders();
        headers.set("X-Admin-Secret", backendToken);
        HttpEntity<TransaccionResponse> entity = new HttpEntity<>(dto, headers);

        try {
            retryTemplate.execute(ctx -> {
                log.info("\uD83D\uDCE4 Enviando notificación de transacción aprobada al backend: {} -> {}", dto.getId(), url);
                restTemplate.exchange(url, HttpMethod.POST, entity, Void.class);
                log.info("\u2705 Notificación enviada correctamente para transacción {}", dto.getId());
                return null;
            });
        } catch (Exception e) {
            log.error("\u274C Error al enviar notificación al backend principal", e);
        }
    }
}
