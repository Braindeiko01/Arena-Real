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

public class FirebaseJwtDecoder implements JwtDecoder {

    private final ObjectProvider<FirebaseApp> firebaseAppProvider;

    public FirebaseJwtDecoder(ObjectProvider<FirebaseApp> firebaseAppProvider) {
        this.firebaseAppProvider = firebaseAppProvider;
    }

    @Override
    public Jwt decode(String token) throws JwtException {
        FirebaseApp app = firebaseAppProvider.getIfAvailable();
        if (app == null) {
            throw new JwtException("Firebase not configured");
        }
        try {
            FirebaseToken fbToken = FirebaseAuth.getInstance(app).verifyIdToken(token);
            Map<String, Object> claims = new HashMap<>(fbToken.getClaims());
            claims.put("firebase", true);
            Long issued = getLongClaim(claims.get("iat"));
            Long expires = getLongClaim(claims.get("exp"));
            Jwt.Builder builder = Jwt.withTokenValue(token)
                    .subject(fbToken.getUid())
                    .claims(map -> map.putAll(claims));
            if (issued != null) {
                builder.issuedAt(Instant.ofEpochSecond(issued));
            }
            if (expires != null) {
                builder.expiresAt(Instant.ofEpochSecond(expires));
            }
            return builder.build();
        } catch (FirebaseAuthException ex) {
            throw new JwtException("Invalid Firebase token", ex);
        }
    }

    private Long getLongClaim(Object value) {
        if (value instanceof Number number) {
            return number.longValue();
        }
        return null;
    }
}
