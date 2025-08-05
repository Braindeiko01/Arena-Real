package co.com.arena.real.application.service;

import java.util.Optional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class TokenValidationService {

    private final JwtDecoderResolver decoderResolver;

    public Optional<Jwt> validate(String token) {
        return decoderResolver.decode(token)
                .map(JwtDecoderResolver.DecodedToken::jwt);
    }
}
