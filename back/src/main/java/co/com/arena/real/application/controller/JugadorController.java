package co.com.arena.real.application.controller;

import co.com.arena.real.application.service.JugadorService;
import co.com.arena.real.infrastructure.dto.rq.JugadorRequest;
import co.com.arena.real.infrastructure.dto.rs.JugadorResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequestMapping("/api/jugadores")
@Tag(name = "Jugadores", description = "Operaciones de jugadores")
@RequiredArgsConstructor
public class JugadorController {

    private final JugadorService jugadorService;

    @PutMapping
    @Operation(summary = "Registrar jugador", description = "Registra un nuevo jugador")
    public ResponseEntity<JugadorResponse> registrar(@Valid @RequestBody JugadorRequest jugador) {
        JugadorResponse nuevo = jugadorService.registrarJugador(jugador);
        return ResponseEntity.status(HttpStatus.CREATED).body(nuevo);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Obtener jugador", description = "Obtiene un jugador por su identificador")
    public ResponseEntity<JugadorResponse> obtener(@PathVariable String id) {
        return jugadorService.obtenerPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
