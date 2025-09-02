package co.com.arena.real.application.service;
import java.util.Map;
import java.util.HashMap;

import com.google.cloud.Timestamp;
import com.google.cloud.firestore.QuerySnapshot;

import co.com.arena.real.domain.entity.Chat;
import co.com.arena.real.infrastructure.repository.ChatRepository;
import com.google.cloud.firestore.CollectionReference;
import com.google.cloud.firestore.Firestore;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class ChatService {

    private static final Logger log = LoggerFactory.getLogger(ChatService.class);

    private final ChatRepository chatRepository;
    private final Firestore firestore;

    public ChatService(ChatRepository chatRepository,
                       @Autowired(required = false) Firestore firestore) {
        this.chatRepository = chatRepository;
        this.firestore = firestore;
    }

    public UUID crearChatParaPartida(String jugador1Id, String jugador2Id) {
        log.info("Creando chat para partida entre {} y {}", jugador1Id, jugador2Id);
        Chat chat = Chat.builder()
                .jugadores(List.of(jugador1Id, jugador2Id))
                .activo(true)
                .build();

        Chat saved = chatRepository.save(chat);

        if (firestore != null) {
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
        } else {
            log.warn("Firestore no configurado, se omite la creación del chat en Firestore");
        }

        return saved.getId();
    }

    public UUID crearChat(String jugador1Id, String jugador2Id) {
        return chatRepository.findBetween(jugador1Id, jugador2Id)
                .map(chat -> {
                    log.info("Reutilizando chat existente {} entre {} y {}", chat.getId(), jugador1Id, jugador2Id);
                    return chat.getId();
                })
                .orElseGet(() -> crearChatParaPartida(jugador1Id, jugador2Id));
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

        if (firestore != null) {
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
        } else {
            log.warn("Firestore no configurado, se omite el cierre del chat en Firestore");
        }
    }

    private void enviarMensajeSistema(UUID chatId, String text) {
        if (firestore == null) {
            log.warn("Firestore no configurado, se omite el envío del mensaje de sistema");
            return;
        }
        try {
            java.util.Map<String, Object> msg = new java.util.HashMap<>();
            msg.put("senderId", "system");
            msg.put("text", text);
            msg.put("timestamp", com.google.cloud.Timestamp.now());
            msg.put("isSystemMessage", true);

            firestore.collection("chats")
                    .document(chatId.toString())
                    .collection("messages")
                    .add(msg);
        } catch (Exception e) {
            log.error("Error al enviar mensaje de sistema", e);
        }
    }
    public void enviarMensajeInicio(UUID chatId) {
        if (firestore == null) {
            log.warn("Firestore no configurado, se omite el envío del mensaje de inicio");
            return;
        }

        try {
            CollectionReference mensajes = firestore
                    .collection("chats")
                    .document(chatId.toString())
                    .collection("messages");

            QuerySnapshot snapshot = mensajes
                    .whereEqualTo("text", "Partida iniciada")
                    .whereEqualTo("senderId", "system")
                    .get()
                    .get(); // Bloqueante, esperará respuesta

            if (snapshot.isEmpty()) {
                log.info("Enviando mensaje de inicio para el chat {}", chatId);

                Map<String, Object> msg = new HashMap<>();
                msg.put("senderId", "system");
                msg.put("text", "Partida iniciada");
                msg.put("timestamp", Timestamp.now());
                msg.put("isSystemMessage", true);

                mensajes.add(msg);
            } else {
                log.info("Mensaje de inicio ya existe para el chat {}", chatId);
            }

        } catch (Exception e) {
            log.error("Error al enviar mensaje de inicio", e);
        }
    }


    public void compartirLink(UUID chatId, String text) {
        enviarMensajeSistema(chatId, text);
    }

    public void enviarMensajeResultado(UUID chatId, String text) {
        enviarMensajeSistema(chatId, text);
    }
}


