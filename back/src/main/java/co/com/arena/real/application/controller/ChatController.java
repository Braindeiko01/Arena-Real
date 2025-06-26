package co.com.arena.real.application.controller;

import co.com.arena.real.application.service.ChatService;
import co.com.arena.real.application.service.PartidaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/chats")
@RequiredArgsConstructor
public class ChatController {

    private final ChatService chatService;
    private final PartidaService partidaService;

    @GetMapping("/between")
    public ResponseEntity<Map<String, UUID>> getChatId(@RequestParam String jugador1Id,
                                                       @RequestParam String jugador2Id) {
        UUID id = chatService.crearChat(jugador1Id, jugador2Id);
        return ResponseEntity.ok(Map.of("chatId", id));
    }

    @GetMapping("/partida/{partidaId}")
    public ResponseEntity<Map<String, UUID>> getChatIdByPartida(@PathVariable UUID partidaId) {
        return partidaService.obtenerChatActivo(partidaId)
                .map(id -> ResponseEntity.ok(Map.of("chatId", id)))
                .orElse(ResponseEntity.notFound().build());
    }
}
