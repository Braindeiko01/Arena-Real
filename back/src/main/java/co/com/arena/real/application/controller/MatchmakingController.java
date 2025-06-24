package co.com.arena.real.application.controller;

import co.com.arena.real.application.service.MatchmakingService;
import co.com.arena.real.infrastructure.dto.rq.CancelarMatchmakingRequest;
import co.com.arena.real.infrastructure.dto.rq.PartidaEnEsperaRequest;
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
                    Map<String, Object> partidaMap = new HashMap<>();
                    partidaMap.put("id", partida.getId());
                    Map<String, Object> resp = new HashMap<>();
                    resp.put("match", true);
                    resp.put("partida", partidaMap);
                    return ResponseEntity.ok(resp);
                })
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
