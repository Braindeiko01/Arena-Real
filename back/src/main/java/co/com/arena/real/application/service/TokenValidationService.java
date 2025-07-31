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
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;

@Service
public class TokenValidationService {

    private final JwtDecoder jwtDecoder;
    private final ObjectProvider<FirebaseApp> firebaseAppProvider;

    public TokenValidationService(
            @Qualifier("hs256JwtDecoder") JwtDecoder jwtDecoder,
            ObjectProvider<FirebaseApp> firebaseAppProvider) {
        this.jwtDecoder = jwtDecoder;
        this.firebaseAppProvider = firebaseAppProvider;
    }

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
                    return java.util.Optional.of(builder.build());
                } catch (FirebaseAuthException ignore) {
                }
            }
        }
        return java.util.Optional.empty();
    }

    private Long getLongClaim(Object value) {
        if (value instanceof Number number) {
            return number.longValue();
        }
        return null;
    }
}
