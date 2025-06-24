package co.com.arena.real.application.controller;

import co.com.arena.real.application.service.ApuestaService;
import co.com.arena.real.domain.entity.EstadoApuesta;
import co.com.arena.real.infrastructure.dto.rs.ApuestaResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
@RequestMapping("/api/apuestas")
@Tag(name = "Apuestas", description = "Administración de apuestas")
@RequiredArgsConstructor
public class ApuestaController {

    private final ApuestaService apuestaService;

    @PutMapping("/{id}/estado")
    @Operation(summary = "Cambiar estado", description = "Actualiza el estado de una apuesta")
    public ResponseEntity<ApuestaResponse> cambiarEstado(@PathVariable UUID id,
                                                         @RequestParam("estado") EstadoApuesta estado) {
        ApuestaResponse response = apuestaService.cambiarEstado(id, estado);
        return ResponseEntity.ok(response);
    }
}
