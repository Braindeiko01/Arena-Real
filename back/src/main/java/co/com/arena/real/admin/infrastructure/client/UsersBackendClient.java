package co.com.arena.real.admin.infrastructure.client;

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

    public void notifyTransactionApproved(TransaccionResponse dto) {
        String url = backendUrl + "/api/internal/notify-transaction-approved";

        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(backendToken);
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

    public void notifyPrizeDistributed(TransaccionResponse dto) {
        String url = backendUrl + "/api/internal/notify-prize-distributed";

        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(backendToken);
        HttpEntity<TransaccionResponse> entity = new HttpEntity<>(dto, headers);

        try {
            retryTemplate.execute(ctx -> {
                log.info("\uD83D\uDCE4 Enviando notificación de premio al backend: {} -> {}", dto.getId(), url);
                restTemplate.exchange(url, HttpMethod.POST, entity, Void.class);
                log.info("\u2705 Notificación de premio enviada correctamente para transacción {}", dto.getId());
                return null;
            });
        } catch (Exception e) {
            log.error("\u274C Error al enviar notificación de premio al backend principal", e);
        }
    }
}
