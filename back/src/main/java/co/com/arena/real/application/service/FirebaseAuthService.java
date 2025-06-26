package co.com.arena.real.application.service;

import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseAuthException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class FirebaseAuthService {

    public String createCustomToken(String uid) {
        try {
            return FirebaseAuth.getInstance().createCustomToken(uid);
        } catch (FirebaseAuthException e) {
            throw new RuntimeException("Error creando token", e);
        }
    }
}
