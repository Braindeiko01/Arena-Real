package co.com.arena.real.application.controller;

import co.com.arena.real.application.service.MatchmakingService;
import co.com.arena.real.infrastructure.dto.rq.CancelarMatchmakingRequest;
import co.com.arena.real.infrastructure.dto.rq.PartidaEnEsperaRequest;
import co.com.arena.real.infrastructure.dto.rs.MatchSseDto;
import co.com.arena.real.domain.entity.Jugador;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/matchmaking")
@RequiredArgsConstructor
public class    MatchmakingController {

    private final MatchmakingService matchmakingService;

    @PostMapping("/ejecutar")
    public ResponseEntity<?> ejecutarMatchmaking(@RequestBody PartidaEnEsperaRequest request) {
        return matchmakingService.intentarEmparejar(request)
                .map(partida -> {
                    Jugador oponente = partida.getJugador1().getId().equals(request.getJugadorId())
                            ? partida.getJugador2()
                            : partida.getJugador1();

                    String tag = oponente.getTagClash() != null ? oponente.getTagClash() : oponente.getNombre();
                    return MatchSseDto.builder()
                            .apuestaId(partida.getApuesta().getId())
                            .chatId(partida.getChatId())
                            .jugadorOponenteId(oponente.getId())
                            .jugadorOponenteTag(tag)
                            .build();
                })
                .<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElseGet(() -> {
                    Map<String, Object> resp = new HashMap<>();
                    resp.put("status", "esperando");
                    return ResponseEntity.ok(resp);
                });
    }

    @PostMapping("/cancelar")
    public ResponseEntity<?> cancelarMatchmaking(@RequestBody CancelarMatchmakingRequest request) {
        matchmakingService.cancelarSolicitudes(request.getJugadorId());
        Map<String, Object> resp = new HashMap<>();
        resp.put("status", "cancelado");
        return ResponseEntity.ok(resp);
    }
}
