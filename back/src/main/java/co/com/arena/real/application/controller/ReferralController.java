package co.com.arena.real.application.controller;

import co.com.arena.real.application.service.JugadorService;
import co.com.arena.real.application.service.ReferralRewardService;
import co.com.arena.real.infrastructure.dto.rq.JugadorRequest;
import co.com.arena.real.infrastructure.dto.rs.JugadorResponse;
import co.com.arena.real.infrastructure.dto.rs.ReferralEarningResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class ReferralController {

    private final JugadorService jugadorService;
    private final ReferralRewardService rewardService;

    @PostMapping("/register")
    public ResponseEntity<JugadorResponse> register(@RequestBody JugadorRequest body) {
        JugadorResponse response = jugadorService.registrarJugador(body);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/referrals/earnings/{userId}")
    public ResponseEntity<Map<String, Object>> earnings(@PathVariable String userId) {
        BigDecimal total = rewardService.earningsForUser(userId);
        return ResponseEntity.ok(Map.of("total", total));
    }

    @GetMapping("/referrals/referred/{userId}")
    public ResponseEntity<List<ReferralEarningResponse>> referred(@PathVariable String userId) {
        List<ReferralEarningResponse> response = rewardService.rewardsForUser(userId).stream()
                .map(r -> ReferralEarningResponse.builder()
                        .referredName(r.getReferred().getNombre())
                        .amount(r.getAmount())
                        .build())
                .toList();
        return ResponseEntity.ok(response);
    }

}
