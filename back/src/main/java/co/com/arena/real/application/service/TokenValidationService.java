package co.com.arena.real.application.service;

import com.google.firebase.FirebaseApp;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseAuthException;
import com.google.firebase.auth.FirebaseToken;
import java.time.Instant;
import java.util.HashMap;
import java.util.Map;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtException;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class TokenValidationService {

    private final JwtDecoder jwtDecoder;
    private final ObjectProvider<FirebaseApp> firebaseAppProvider;

    public java.util.Optional<Jwt> validate(String token) {
        if (token == null || token.isBlank()) {
            return java.util.Optional.empty();
        }
        try {
            Jwt jwt = jwtDecoder.decode(token);
            String scope = jwt.getClaimAsString("scope");
            if ("ADMIN".equals(scope) || "USER".equals(scope) || jwt.hasClaim("firebase")) {
                return java.util.Optional.of(jwt);
            }
        } catch (JwtException ex) {
            FirebaseApp app = firebaseAppProvider.getIfAvailable();
            if (app != null) {
                try {
                    FirebaseToken fbToken = FirebaseAuth.getInstance(app).verifyIdToken(token);
                    Map<String, Object> claims = new HashMap<>(fbToken.getClaims());
                    claims.put("firebase", true);
                    Jwt jwt = Jwt.withTokenValue(token)
                            .subject(fbToken.getUid())
                            .issuedAt(Instant.ofEpochSecond(fbToken.getIssuedAtTimestamp() / 1000))
                            .expiresAt(Instant.ofEpochSecond(fbToken.getExpirationTimestamp() / 1000))
                            .claims(claims)
                            .build();
                    return java.util.Optional.of(jwt);
                } catch (FirebaseAuthException ignore) {
                }
            }
        }
        return java.util.Optional.empty();
    }
}
