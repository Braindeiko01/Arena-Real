package co.com.arena.real.application.service;

import co.com.arena.real.domain.entity.Jugador;
import co.com.arena.real.domain.entity.PushToken;
import co.com.arena.real.infrastructure.repository.PushTokenRepository;
import com.google.firebase.FirebaseApp;
import com.google.firebase.messaging.FirebaseMessaging;
import com.google.firebase.messaging.Message;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.autoconfigure.condition.ConditionalOnBean;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@ConditionalOnBean(FirebaseApp.class)
@Slf4j
public class PushNotificationService {

    private final PushTokenRepository pushTokenRepository;
    private final FirebaseMessaging firebaseMessaging;

    public void registerToken(Jugador jugador, String token) {
        pushTokenRepository.findByToken(token).ifPresentOrElse(existing -> {
            existing.setJugador(jugador);
            pushTokenRepository.save(existing);
        }, () -> {
            PushToken pt = PushToken.builder()
                    .jugador(jugador)
                    .token(token)
                    .build();
            pushTokenRepository.save(pt);
        });
    }

    public void sendMatchFound(Jugador receptor, String oponenteNombre) {
        List<PushToken> tokens = pushTokenRepository.findAllByJugador(receptor);
        for (PushToken token : tokens) {
            Message msg = Message.builder()
                    .putData("type", "match-found")
                    .putData("oponente", oponenteNombre)
                    .setToken(token.getToken())
                    .build();
            try {
                firebaseMessaging.send(msg);
            } catch (Exception e) {
                log.error("Error enviando notificación push", e);
            }
        }
    }
}
