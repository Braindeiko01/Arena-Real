package co.com.arena.real.infrastructure.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

import java.io.Serial;

@ResponseStatus(HttpStatus.CONFLICT)
public class DuplicateUserException extends RuntimeException {
    @Serial
    private static final long serialVersionUID = -2943248110390378431L;

    public DuplicateUserException(String message) {
        super(message);
    }
}
