package co.com.arena.real.application.service;

import java.util.Optional;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtException;
import org.springframework.stereotype.Component;

@Component
@Slf4j
public class JwtDecoderResolver {

    private final JwtDecoder adminDecoder;
    private final JwtDecoder firebaseDecoder;

    public JwtDecoderResolver(
            @Qualifier("hs256JwtDecoder") JwtDecoder adminDecoder,
            @Qualifier("firebaseJwtDecoder") JwtDecoder firebaseDecoder) {
        this.adminDecoder = adminDecoder;
        this.firebaseDecoder = firebaseDecoder;
    }

    public Optional<DecodedToken> decode(String token) {
        if (token == null || token.isBlank()) {
            return Optional.empty();
        }
        try {
            Jwt jwt = adminDecoder.decode(token);
            String scope = jwt.getClaimAsString("scope");
            if ("ADMIN".equals(scope) || "USER".equals(scope)) {
                return Optional.of(new DecodedToken(jwt, Provider.ADMIN));
            } else if (jwt.hasClaim("firebase")) {
                return Optional.of(new DecodedToken(jwt, Provider.FIREBASE));
            }
        } catch (JwtException ex) {
            // Not an HS256 token, try Firebase
        }

        try {
            Jwt firebaseJwt = firebaseDecoder.decode(token);
            return Optional.of(new DecodedToken(firebaseJwt, Provider.FIREBASE));
        } catch (JwtException ex) {
            log.debug("Invalid Firebase token: {}", ex.getMessage());
        }
        return Optional.empty();
    }

    public enum Provider {
        ADMIN,
        FIREBASE
    }

    public record DecodedToken(Jwt jwt, Provider provider) {
    }
}
