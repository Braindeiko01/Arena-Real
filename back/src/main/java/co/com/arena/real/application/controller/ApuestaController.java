package co.com.arena.real.application.controller;

import co.com.arena.real.application.service.ApuestaService;
import co.com.arena.real.domain.entity.EstadoApuesta;
import co.com.arena.real.domain.entity.Apuesta;
import co.com.arena.real.infrastructure.dto.rq.ApuestaRequest;
import co.com.arena.real.infrastructure.dto.rs.ApuestaResponse;
import co.com.arena.real.infrastructure.mapper.ApuestaMapper;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
@RequestMapping("/api/apuestas")
@Tag(name = "Apuestas", description = "Gestión de apuestas")
@RequiredArgsConstructor
public class ApuestaController {

    private final ApuestaService apuestaService;

    @PostMapping
    @Operation(summary = "Crear apuesta", description = "Crea una nueva apuesta")
    public ResponseEntity<ApuestaResponse> crear(@Valid @RequestBody ApuestaRequest dto) {
        Apuesta apuesta = apuestaService.crearApuesta(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApuestaMapper.toDto(apuesta));
    }

    @PutMapping("/{id}/estado/{estado}")
    @Operation(summary = "Cambiar estado", description = "Actualiza el estado de la apuesta")
    public ResponseEntity<ApuestaResponse> cambiarEstado(@PathVariable UUID id, @PathVariable String estado) {
        ApuestaResponse response = apuestaService.cambiarEstado(id, EstadoApuesta.valueOf(estado));
        return ResponseEntity.ok(response);
    }
}
