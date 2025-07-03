package co.com.arena.real.application.controller;

import co.com.arena.real.application.service.PartidaService;
import co.com.arena.real.infrastructure.dto.rq.PartidaResultadoRequest;
import co.com.arena.real.infrastructure.dto.rs.PartidaResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
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

    @GetMapping("/chat/{chatId}")
    @Operation(summary = "Buscar por chat", description = "Obtiene la partida asociada a un chat")
    public ResponseEntity<PartidaResponse> obtenerPorChat(@PathVariable String chatId) {
        try {
            UUID uuid = UUID.fromString(chatId);
            return partidaService.obtenerPorChatId(uuid)
                    .map(ResponseEntity::ok)
                    .orElse(ResponseEntity.notFound().build());
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{id}/aceptar/{jugadorId}")
    @Operation(summary = "Aceptar partida", description = "Marca la partida como aceptada por el jugador")
    public ResponseEntity<PartidaResponse> aceptarPartida(
            @PathVariable("id") UUID id,
            @PathVariable("jugadorId") String jugadorId) {
        PartidaResponse response = partidaService.aceptarPartida(id, jugadorId);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}/validar")
    @Operation(summary = "Validar", description = "Marca una partida como validada y reparte el premio")
    public ResponseEntity<PartidaResponse> validar(@PathVariable UUID id) {
        PartidaResponse response = partidaService.marcarComoValidada(id);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}/cancelar")
    @Operation(summary = "Cancelar partida", description = "Cancela la partida y reembolsa la apuesta")
    public ResponseEntity<PartidaResponse> cancelar(@PathVariable UUID id) {
        PartidaResponse response = partidaService.cancelarPartida(id);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}/resultado")
    @Operation(
            summary = "Reportar resultado",
            description = "Envía el resultado de un jugador y la captura"
    )
    public ResponseEntity<PartidaResponse> reportarResultado(
            @PathVariable("id") UUID id,
            @RequestBody PartidaResultadoRequest dto
    ) {
        PartidaResponse response = partidaService.reportarResultado(id, dto);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}/ganador/{jugadorId}")
    @Operation(
            summary = "Asignar ganador",
            description = "Asigna el jugador ganador de la partida"
    )
    public ResponseEntity<PartidaResponse> asignarGanador(
            @PathVariable("id") UUID id,
            @PathVariable("jugadorId") String jugadorId
    ) {
        PartidaResponse response = partidaService.asignarGanador(id, jugadorId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/jugador/{jugadorId}")
    @Operation(summary = "Historial", description = "Obtiene las partidas finalizadas de un jugador")
    public ResponseEntity<java.util.List<PartidaResponse>> historial(@PathVariable String jugadorId) {
        java.util.List<PartidaResponse> lista = partidaService.listarHistorial(jugadorId);
        return ResponseEntity.ok(lista);
    }
}
