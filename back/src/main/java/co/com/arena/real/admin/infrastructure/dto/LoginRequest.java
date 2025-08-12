package co.com.arena.real.admin.infrastructure.dto;

import lombok.Data;

/**
 * Request body for admin login.
 */
@Data
public class LoginRequest {

    private String username;
    private String password;
}
