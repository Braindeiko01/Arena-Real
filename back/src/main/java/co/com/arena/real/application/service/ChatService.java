package co.com.arena.real.application.service;

import co.com.arena.real.domain.entity.Chat;
import co.com.arena.real.infrastructure.repository.ChatRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ChatService {

    private final ChatRepository chatRepository;

    public UUID crearChatParaPartida(String jugador1Id, String jugador2Id) {
        Chat chat = Chat.builder()
                .id(UUID.randomUUID())
                .jugadores(List.of(jugador1Id, jugador2Id))
                .build();

        chatRepository.save(chat);
        return chat.getId();
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

    }

    public void cerrarChat(UUID chatId) {
        if (chatId != null) {
            chatRepository.deleteById(chatId);
        }
    }
}


