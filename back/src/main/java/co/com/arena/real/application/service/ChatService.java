package co.com.arena.real.application.service;

import co.com.arena.real.domain.entity.Chat;
import co.com.arena.real.infrastructure.repository.ChatRepository;
import com.google.cloud.firestore.Firestore;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ChatService {

    private final ChatRepository chatRepository;
    private final Firestore firestore;

    public UUID crearChatParaPartida(String jugador1Id, String jugador2Id) {
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
        } catch (Exception ignored) {
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
        chatRepository.findById(chatId).ifPresent(chat -> {
            chat.setActivo(false);
            chatRepository.save(chat);
        });

        try {
            firestore.collection("chats")
                    .document(chatId.toString())
                    .update("activo", false);
        } catch (Exception ignored) {
        }
    }
}


