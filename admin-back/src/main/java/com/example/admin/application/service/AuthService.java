package com.example.admin.application.service;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.JwsHeader;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final JwtEncoder encoder;

    @Value("${admin.credentials.user:admin}")
    private String adminUser;

    @Value("${admin.credentials.password:admin}")
    private String adminPassword;

    public Optional<String> authenticate(String username, String password) {
        if (adminUser.equals(username) && adminPassword.equals(password)) {
            JwtClaimsSet claims = JwtClaimsSet.builder()
                    .subject(username)
                    .issuedAt(Instant.now())
                    .expiresAt(Instant.now().plus(1, ChronoUnit.HOURS))
                    .claim("scope", "ROLE_ADMIN")
                    .build();
            JwsHeader header = JwsHeader.with(MacAlgorithm.HS256).build();
            String token = encoder.encode(JwtEncoderParameters.from(header, claims)).getTokenValue();
            return Optional.of(token);
        }
        return Optional.empty();
    }
}
