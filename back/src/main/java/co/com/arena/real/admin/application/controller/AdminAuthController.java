package co.com.arena.real.admin.application.controller;

import co.com.arena.real.admin.infrastructure.dto.LoginRequest;
import co.com.arena.real.admin.infrastructure.exception.InvalidCredentialsException;
import co.com.arena.real.admin.infrastructure.security.JwtUtil;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Controller that handles admin authentication and issues JWT tokens.
 */
@RestController
@RequestMapping("/api/admin/auth")
@RequiredArgsConstructor
public class AdminAuthController {

    private final JwtUtil jwtUtil;

    @Value("${admin.credentials.user}")
    private String adminUser;

    @Value("${admin.credentials.password}")
    private String adminPassword;

    /**
     * Authenticates the admin user using configured credentials and returns a JWT.
     */
    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> login(@RequestBody LoginRequest request) {
        if (adminUser.equals(request.getUsername()) && adminPassword.equals(request.getPassword())) {
            String token = jwtUtil.generateToken(request.getUsername());
            return ResponseEntity.ok(Map.of("token", token));
        }
        throw new InvalidCredentialsException("Credenciales inválidas");
    }
}
