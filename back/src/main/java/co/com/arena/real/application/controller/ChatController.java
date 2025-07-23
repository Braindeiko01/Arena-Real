package co.com.arena.real.application.controller;

import co.com.arena.real.application.service.ChatService;
import co.com.arena.real.application.service.PartidaService;
import co.com.arena.real.infrastructure.dto.rq.ShareLinkRequest;
import co.com.arena.real.infrastructure.dto.rq.ResultMessageRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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

    @PostMapping("/{chatId}/start-message")
    public ResponseEntity<Void> startMessage(@PathVariable UUID chatId) {
        chatService.enviarMensajeInicio(chatId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{chatId}/share-link")
    public ResponseEntity<Void> shareLink(@PathVariable UUID chatId,
                                          @RequestBody ShareLinkRequest request) {
        chatService.compartirLink(chatId, request.getText());
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{chatId}/result-message")
    public ResponseEntity<Void> resultMessage(@PathVariable UUID chatId,
                                              @RequestBody ResultMessageRequest request) {
        chatService.enviarMensajeResultado(chatId, request.getText());
        return ResponseEntity.ok().build();
    }
}
