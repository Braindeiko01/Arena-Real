package co.com.arena.real.application.service;

import co.com.arena.real.domain.entity.Apuesta;
import co.com.arena.real.domain.entity.partida.EstadoPartida;
import co.com.arena.real.domain.entity.partida.Partida;
import co.com.arena.real.infrastructure.dto.rq.ApuestaRequest;
import co.com.arena.real.infrastructure.dto.rq.TransaccionRequest;
import co.com.arena.real.infrastructure.dto.rs.TransaccionResponse;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class MatchService {

    private static final Logger log = LoggerFactory.getLogger(MatchService.class);

    private final ChatService chatService;
    private final ApuestaService apuestaService;
    private final TransaccionService transaccionService;
    private final MatchSseService matchSseService;

    public void aceptar(Partida partida, String jugadorId) {
        if (partida.getJugador1() != null && jugadorId.equals(partida.getJugador1().getId())) {
            partida.setAceptadoJugador1(true);
            matchSseService.notifyOpponentAccepted(
                    partida.getApuesta() != null ? partida.getApuesta().getId() : null,
                    partida.getId(),
                    partida.getJugador1(),
                    partida.getJugador2());
        } else if (partida.getJugador2() != null && jugadorId.equals(partida.getJugador2().getId())) {
            partida.setAceptadoJugador2(true);
            matchSseService.notifyOpponentAccepted(
                    partida.getApuesta() != null ? partida.getApuesta().getId() : null,
                    partida.getId(),
                    partida.getJugador2(),
                    partida.getJugador1());
        } else {
            throw new IllegalArgumentException("Jugador no pertenece a la partida");
        }
    }

    public void procesarSiListo(Partida partida) {
        if (partida.isAceptadoJugador1() && partida.isAceptadoJugador2()) {
            if (partida.getApuesta() == null) {
                Apuesta apuesta = apuestaService.crearApuesta(new ApuestaRequest(partida.getMonto()));
                partida.setApuesta(apuesta);
                realizarTransaccion(apuesta, partida.getJugador1().getId());
                realizarTransaccion(apuesta, partida.getJugador2().getId());
            }
            if (partida.getChatId() == null) {
                log.info("Creando chat para partida {}", partida.getId());
                UUID chatId = chatService.crearChatParaPartida(
                        partida.getJugador1().getId(),
                        partida.getJugador2().getId());
                partida.setChatId(chatId);
                log.info("Chat {} creado para partida {}", chatId, partida.getId());
            }
            partida.setEstado(EstadoPartida.EN_CURSO);
            log.info("Notificando chat listo para partida {}", partida.getId());
            matchSseService.notifyChatReady(partida);
        }
    }

    private void realizarTransaccion(Apuesta apuesta, String jugadorId) {
        TransaccionRequest request = TransaccionRequest.builder()
                .monto(apuesta.getMonto())
                .jugadorId(jugadorId)
                .tipo(co.com.arena.real.domain.entity.TipoTransaccion.APUESTA)
                .build();
        TransaccionResponse response = transaccionService.registrarTransaccion(request);
        transaccionService.aprobarTransaccion(response.getId());
    }
}
