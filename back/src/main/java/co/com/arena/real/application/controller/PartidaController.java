package co.com.arena.real.application.controller;

import co.com.arena.real.application.service.PartidaService;
import co.com.arena.real.infrastructure.dto.rs.PartidaResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
@RequestMapping("/api/partidas")
@Tag(name = "Partidas", description = "Gestión de partidas")
@RequiredArgsConstructor
public class PartidaController {

    private final PartidaService partidaService;

    @GetMapping("/apuesta/{apuestaId}")
    @Operation(summary = "Buscar por apuesta", description = "Obtiene la partida asociada a una apuesta")
    public ResponseEntity<PartidaResponse> obtenerPorApuesta(@PathVariable UUID apuestaId) {
        return partidaService.obtenerPorApuestaId(apuestaId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}/validar")
    @Operation(summary = "Validar", description = "Marca una partida como validada y reparte el premio")
    public ResponseEntity<PartidaResponse> validar(@PathVariable UUID id) {
        PartidaResponse response = partidaService.marcarComoValidada(id);
        return ResponseEntity.ok(response);
    }
}
