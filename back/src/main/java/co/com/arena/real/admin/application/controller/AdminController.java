package co.com.arena.real.admin.application.controller;

import co.com.arena.real.admin.application.service.AdminService;
import co.com.arena.real.admin.infrastructure.dto.GameResultDto;
import co.com.arena.real.admin.infrastructure.dto.ImageDto;
import co.com.arena.real.admin.infrastructure.dto.TransactionDto;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.security.access.prepost.PreAuthorize;

import java.util.Map;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;

    @GetMapping("/images")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<ImageDto>> pendingImages() {
        return ResponseEntity.ok(adminService.listPendingImages());
    }

    @PostMapping("/images/{id}/approve")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> approveImage(@PathVariable UUID id) {
        adminService.approveImage(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/transactions")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<TransactionDto>> transactions() {
        return ResponseEntity.ok(adminService.listTransactions());
    }

    @PostMapping("/transactions/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> changeTransactionStatus(@PathVariable UUID id,
                                                       @RequestBody Map<String, String> body) {
        adminService.changeTransactionStatus(id, body.get("status"));
        return ResponseEntity.ok().build();
    }

    @GetMapping("/games/results")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, List<GameResultDto>>> gameResults() {
        return ResponseEntity.ok(Map.of("results", adminService.listGameResults()));
    }

    @PostMapping("/games/{id}/distribute")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> distributePrize(@PathVariable UUID id) {
        adminService.distributePrize(id);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/games/{id}/winner/{playerId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> assignWinner(@PathVariable UUID id,
                                             @PathVariable String playerId) {
        adminService.assignWinner(id, playerId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/bets/{id}/state")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> changeBetState(@PathVariable UUID id,
                                               @RequestParam("state") String state) {
        adminService.changeBetState(id, state);
        return ResponseEntity.ok().build();
    }
}
