package com.example.admin.application.controller;

import com.example.admin.application.service.AuthService;
import com.example.admin.infrastructure.dto.LoginRequest;
import com.example.admin.infrastructure.dto.TokenDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@Slf4j
@RestController
@RequestMapping("/api/admin/auth")
@RequiredArgsConstructor
@CrossOrigin
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<TokenDto> login(@RequestBody LoginRequest request) {
        return authService.authenticate(request.getUsername(), request.getPassword())
                .map(token -> ResponseEntity.ok(new TokenDto(token)))
                .orElseGet(() -> {
                    log.warn("Failed login attempt for user: {}", request.getUsername());
                    return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
                });
    }
}
