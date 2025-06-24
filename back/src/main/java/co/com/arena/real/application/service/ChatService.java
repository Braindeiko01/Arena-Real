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
}


