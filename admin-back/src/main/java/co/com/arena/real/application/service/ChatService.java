package co.com.arena.real.application.service;

import co.com.arena.real.domain.entity.Chat;
import co.com.arena.real.infrastructure.repository.ChatRepository;
import com.google.cloud.firestore.Firestore;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ChatService {

    private static final Logger log = LoggerFactory.getLogger(ChatService.class);

    private final ChatRepository chatRepository;
    private final Firestore firestore;

    public UUID crearChatParaPartida(String jugador1Id, String jugador2Id) {
        log.info("Creando chat para partida entre {} y {}", jugador1Id, jugador2Id);
        Chat chat = Chat.builder()
                .jugadores(List.of(jugador1Id, jugador2Id))
                .build();

        Chat saved = chatRepository.save(chat);

        try {
            java.util.Map<String, Object> data = new java.util.HashMap<>();
            data.put("jugadores", List.of(jugador1Id, jugador2Id));
            data.put("activo", true);
            firestore.collection("chats")
                    .document(saved.getId().toString())
                    .set(data);
        } catch (Exception e) {
            log.error("Error al crear documento de chat en Firestore", e);
        }

        return saved.getId();
    }

    public UUID crearChat(String jugador1Id, String jugador2Id) {
        return crearChatParaPartida(jugador1Id, jugador2Id);
    }

    public void cerrarChat(UUID chatId) {
        if (chatId == null) {
            return;
        }
        log.info("Cerrando chat {}", chatId);
        chatRepository.findById(chatId).ifPresent(chat -> {
            chat.setActivo(false);
            chatRepository.save(chat);
        });

        try {
            firestore.collection("chats")
                    .document(chatId.toString())
                    .update("activo", false);

            java.util.Map<String, Object> msg = new java.util.HashMap<>();
            msg.put("senderId", "system");
            msg.put("text", "Chat finalizado");
            msg.put("timestamp", com.google.cloud.Timestamp.now());
            msg.put("isSystemMessage", true);

            firestore.collection("chats")
                    .document(chatId.toString())
                    .collection("messages")
                    .add(msg);
        } catch (Exception e) {
            log.error("Error al cerrar chat en Firestore", e);
        }
    }
}
