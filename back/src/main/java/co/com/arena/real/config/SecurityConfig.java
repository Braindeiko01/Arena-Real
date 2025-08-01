package co.com.arena.real.config;

import org.springframework.beans.factory.ObjectProvider;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.security.oauth2.jwt.NimbusJwtEncoder;
import org.springframework.security.oauth2.jwt.JwtException;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.oauth2.server.resource.authentication.JwtGrantedAuthoritiesConverter;
import com.nimbusds.jose.jwk.source.ImmutableSecret;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.config.Customizer;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationManagerResolver;
import org.springframework.security.authentication.ProviderManager;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationProvider;
import org.springframework.security.authentication.BadCredentialsException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpHeaders;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import lombok.extern.slf4j.Slf4j;
import java.util.List;

import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import co.com.arena.real.application.service.FirebaseJwtDecoder;

@Configuration
@EnableMethodSecurity
@Slf4j
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http,
            AuthenticationManagerResolver<HttpServletRequest> authenticationManagerResolver) throws Exception {
        http.csrf(csrf -> csrf.disable())
            .cors(Customizer.withDefaults())
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/public/**", "/auth/**", "/api/admin/auth/login", "/api/register", "/api/jugadores/**").permitAll()
                .requestMatchers("/api/admin/**", "/api/internal/**").hasRole("ADMIN")
                .requestMatchers("/sse/**", "/api/transacciones/**").hasRole("USER")
                .requestMatchers("/api/push/register").permitAll()
                .anyRequest().permitAll())
            .oauth2ResourceServer(oauth2 -> oauth2
                    .authenticationManagerResolver(authenticationManagerResolver))
            .exceptionHandling(ex -> ex
                    .authenticationEntryPoint((req, res, ae) -> {
                        log.error("Authentication failed", ae);
                        res.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Unauthorized");
                    })
                    .accessDeniedHandler((req, res, ade) -> {
                        log.error("Access denied", ade);
                        res.sendError(HttpServletResponse.SC_FORBIDDEN, "Forbidden");
                    }));
        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(List.of("http://localhost:3000", "http://localhost:3001"));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true);
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }

    private JwtAuthenticationConverter jwtAuthenticationConverter() {
        JwtGrantedAuthoritiesConverter authoritiesConverter = new JwtGrantedAuthoritiesConverter();
        authoritiesConverter.setAuthorityPrefix("ROLE_");
        authoritiesConverter.setAuthoritiesClaimName("scope");
        JwtAuthenticationConverter converter = new JwtAuthenticationConverter();
        converter.setJwtGrantedAuthoritiesConverter(authoritiesConverter);
        return converter;
    }

    private JwtAuthenticationConverter firebaseAuthenticationConverter() {
        JwtAuthenticationConverter converter = new JwtAuthenticationConverter();
        converter.setJwtGrantedAuthoritiesConverter(jwt -> java.util.List.of(new org.springframework.security.core.authority.SimpleGrantedAuthority("ROLE_USER")));
        return converter;
    }

    @Bean("hs256JwtDecoder")
    public JwtDecoder hs256JwtDecoder(@Value("${security.jwt-secret}") String secret) {
        SecretKey key = new SecretKeySpec(secret.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
        return NimbusJwtDecoder.withSecretKey(key).build();
    }

    @Bean
    public JwtDecoder firebaseJwtDecoder(ObjectProvider<com.google.firebase.FirebaseApp> firebaseAppProvider) {
        return new FirebaseJwtDecoder(firebaseAppProvider);
    }

    @Bean
    public AuthenticationManagerResolver<HttpServletRequest> authenticationManagerResolver(
            @Qualifier("hs256JwtDecoder") JwtDecoder hs256JwtDecoder,
            JwtDecoder firebaseJwtDecoder) {
        JwtAuthenticationProvider adminProvider = new JwtAuthenticationProvider(hs256JwtDecoder);
        adminProvider.setJwtAuthenticationConverter(jwtAuthenticationConverter());

        JwtAuthenticationProvider firebaseProvider = new JwtAuthenticationProvider(firebaseJwtDecoder);
        firebaseProvider.setJwtAuthenticationConverter(firebaseAuthenticationConverter());

        AuthenticationManager adminManager = new ProviderManager(adminProvider);
        AuthenticationManager firebaseManager = new ProviderManager(firebaseProvider);

        return request -> {
            String header = request.getHeader(HttpHeaders.AUTHORIZATION);
            if (header != null && header.startsWith("Bearer ")) {
                String token = header.substring(7);
                String tokenSnippet = token.length() > 8 ? token.substring(0, 8) + "..." : token;
                log.debug("Token recibido snippet: {}", tokenSnippet);
                log.debug("Resolving token for request {} {}", request.getMethod(), request.getRequestURI());
                try {
                    hs256JwtDecoder.decode(token);
                    log.debug("Token validated as admin token");
                    return adminManager;
                } catch (JwtException ex) {
                    log.debug("Not an admin token: {}", ex.getMessage());
                } catch (Exception ex) {
                    log.error("Error decoding admin token", ex);
                }

                try {
                    firebaseJwtDecoder.decode(token);
                    log.debug("Token validated as Firebase token");
                    return firebaseManager;
                } catch (JwtException ex2) {
                    log.debug("Invalid Firebase token: {}", ex2.getMessage());
                } catch (Exception ex2) {
                    log.error("Error decoding Firebase token", ex2);
                }

                return auth -> { throw new BadCredentialsException("Invalid token"); };
            }
            return auth -> { throw new BadCredentialsException("Missing bearer token"); };
        };
    }

    @Bean
    @Primary
    public JwtEncoder jwtEncoder(@Value("${security.jwt-secret}") String secret) {
        log.debug("Initializing JWT encoder");
        SecretKey key = new SecretKeySpec(secret.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
        return new NimbusJwtEncoder(new ImmutableSecret<>(key));
    }
}
