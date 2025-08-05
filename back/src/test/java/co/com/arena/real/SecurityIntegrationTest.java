package co.com.arena.real;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.time.Instant;
import java.util.Collections;

import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Primary;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.security.oauth2.jwt.JwsHeader;
import org.springframework.security.oauth2.jwt.JwtException;
import org.springframework.test.web.servlet.MockMvc;

import co.com.arena.real.admin.application.service.AdminService;
import co.com.arena.real.application.service.SseService;
import co.com.arena.real.application.service.MatchSseService;
import co.com.arena.real.application.service.TransaccionService;

@SpringBootTest(properties = {"security.jwt-secret=test-secret", "firebase.enabled=false"})
@AutoConfigureMockMvc
class SecurityIntegrationTest {

    private static final String VALID_FIREBASE_TOKEN = "firebase-token";
    private static final String FIREBASE_SUBJECT = "user123";

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private JwtEncoder jwtEncoder;

    @MockBean
    private AdminService adminService;

    @MockBean
    private TransaccionService transaccionService;

    @MockBean
    private SseService sseService;

    @MockBean
    private MatchSseService matchSseService;

    @TestConfiguration
    static class DecoderConfig {
        @Bean("firebaseJwtDecoder")
        @Primary
        JwtDecoder firebaseJwtDecoder() {
            return token -> {
                if (VALID_FIREBASE_TOKEN.equals(token)) {
                    return Jwt.withTokenValue(token)
                            .header("alg", "none")
                            .subject(FIREBASE_SUBJECT)
                            .claim("firebase", true)
                            .build();
                }
                throw new JwtException("Invalid Firebase token");
            };
        }
    }

    private String createAdminToken() {
        JwtClaimsSet claims = JwtClaimsSet.builder()
                .subject("admin")
                .issuedAt(Instant.now())
                .expiresAt(Instant.now().plusSeconds(3600))
                .claim("scope", "ADMIN")
                .build();
        JwsHeader header = JwsHeader.with(MacAlgorithm.HS256).build();
        return jwtEncoder.encode(JwtEncoderParameters.from(header, claims)).getTokenValue();
    }

    @Test
    void adminTokenCanAccessAdminEndpoint() throws Exception {
        Mockito.when(adminService.listPendingImages()).thenReturn(Collections.emptyList());

        String token = createAdminToken();
        mockMvc.perform(get("/api/admin/images")
                .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk());
    }

    @Test
    void firebaseTokenCanAccessTransaccionesEndpoint() throws Exception {
        Mockito.when(transaccionService.listarPorJugador(FIREBASE_SUBJECT)).thenReturn(Collections.emptyList());

        mockMvc.perform(get("/api/transacciones/jugador/" + FIREBASE_SUBJECT)
                .header("Authorization", "Bearer " + VALID_FIREBASE_TOKEN))
                .andExpect(status().isOk());
    }

    @Test
    void requestWithoutTokenIsUnauthorized() throws Exception {
        mockMvc.perform(get("/api/admin/images"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void invalidTokenIsUnauthorized() throws Exception {
        mockMvc.perform(get("/api/transacciones/jugador/" + FIREBASE_SUBJECT)
                .header("Authorization", "Bearer invalid"))
                .andExpect(status().isUnauthorized());
    }
}
