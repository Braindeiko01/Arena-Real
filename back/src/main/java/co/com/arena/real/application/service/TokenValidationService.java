package co.com.arena.real.application.service;

import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtException;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class TokenValidationService {

    private final @Qualifier("hs256JwtDecoder") JwtDecoder jwtDecoder;
    private final JwtDecoder firebaseJwtDecoder;

    public TokenValidationService(
            @Qualifier("hs256JwtDecoder") JwtDecoder jwtDecoder,
            @Qualifier("firebaseJwtDecoder") JwtDecoder firebaseJwtDecoder) {
        this.jwtDecoder = jwtDecoder;
        this.firebaseJwtDecoder = firebaseJwtDecoder;
    }

    public java.util.Optional<Jwt> validate(String token) {
        if (token == null || token.isBlank()) {
            return java.util.Optional.empty();
        }
        try {
            Jwt jwt = jwtDecoder.decode(token);
            String scope = jwt.getClaimAsString("scope");
            if ("ADMIN".equals(scope) || "USER".equals(scope)) {
                log.debug("Token validated as {} token", scope);
                return java.util.Optional.of(jwt);
            } else if (jwt.hasClaim("firebase")) {
                log.debug("Token already contains firebase claim. Granting ROLE_USER");
                return java.util.Optional.of(jwt);
            }
        } catch (JwtException ignore) {
            // Not a HS256 token, try Firebase
        }

        try {
            Jwt firebaseJwt = firebaseJwtDecoder.decode(token);
            log.debug("Token validated via Firebase. Granting ROLE_USER");
            return java.util.Optional.of(firebaseJwt);
        } catch (JwtException ex) {
            log.debug("Invalid Firebase token: {}", ex.getMessage());
        }

        return java.util.Optional.empty();
    }
}
