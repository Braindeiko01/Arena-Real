package co.com.arena.real.application.controller;

import co.com.arena.real.application.service.SseService;
import co.com.arena.real.application.service.TransaccionService;
import co.com.arena.real.infrastructure.dto.rq.TransaccionRequest;
import co.com.arena.real.infrastructure.dto.rs.TransaccionResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/transacciones")
@Tag(name = "Transacciones", description = "Movimientos de saldo")
@RequiredArgsConstructor
public class TransaccionController {

    private final TransaccionService transaccionService;
    private final SseService sseService;

    @PostMapping
    @Operation(summary = "Registrar transacción", description = "Crea una nueva transacción")
    public ResponseEntity<TransaccionResponse> crear(@RequestBody TransaccionRequest dto) {
        TransaccionResponse response = transaccionService.registrarTransaccion(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/jugador/{id}")
    @Operation(summary = "Listar por jugador", description = "Obtiene las transacciones de un jugador")
    public ResponseEntity<List<TransaccionResponse>> listarPorJugador(@PathVariable("id") String jugadorId) {
        List<TransaccionResponse> lista = transaccionService.listarPorJugador(jugadorId);
        return ResponseEntity.ok(lista);
    }

    @GetMapping("/stream/{jugadorId}")
    public SseEmitter stream(@PathVariable String jugadorId) {
        return sseService.subscribe(jugadorId); // <- usando tu SseService refactorizado
    }

    @PostMapping("/{id}/aprobar")
    @Operation(summary = "Aprobar transacción", description = "Aprueba la transacción y actualiza el saldo")
    public ResponseEntity<TransaccionResponse> aprobar(@PathVariable UUID id) {
        TransaccionResponse response = transaccionService.aprobarTransaccion(id);
        return ResponseEntity.ok(response);

    }

}
