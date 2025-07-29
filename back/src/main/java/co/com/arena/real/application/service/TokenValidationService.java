package co.com.arena.real.application.service;

import com.google.firebase.FirebaseApp;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseAuthException;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.http.HttpStatus;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtException;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class TokenValidationService {

    private final JwtDecoder jwtDecoder;
    private final ObjectProvider<FirebaseApp> firebaseAppProvider;

    public void validate(String token) {
        if (token == null || token.isBlank()) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED);
        }
        try {
            Jwt jwt = jwtDecoder.decode(token);
            String scope = jwt.getClaimAsString("scope");
            if ("ADMIN".equals(scope) || "USER".equals(scope)) {
                return;
            }
            if (jwt.hasClaim("firebase")) {
                return;
            }
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED);
        } catch (JwtException ex) {
            FirebaseApp app = firebaseAppProvider.getIfAvailable();
            if (app != null) {
                try {
                    FirebaseAuth.getInstance(app).verifyIdToken(token);
                    return;
                } catch (FirebaseAuthException ignore) {
                }
            }
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED);
        }
    }
}
