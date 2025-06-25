package co.com.arena.real.application.service;

import co.com.arena.real.domain.entity.Apuesta;
import co.com.arena.real.domain.entity.EstadoTransaccion;
import co.com.arena.real.domain.entity.TipoTransaccion;
import co.com.arena.real.domain.entity.Transaccion;
import co.com.arena.real.domain.entity.partida.Partida;
import co.com.arena.real.infrastructure.dto.rs.PartidaResponse;
import co.com.arena.real.infrastructure.mapper.PartidaMapper;
import co.com.arena.real.infrastructure.repository.ApuestaRepository;
import co.com.arena.real.infrastructure.repository.JugadorRepository;
import co.com.arena.real.infrastructure.repository.PartidaRepository;
import co.com.arena.real.infrastructure.repository.TransaccionRepository;
import co.com.arena.real.domain.entity.partida.EstadoPartida;
import co.com.arena.real.application.service.ChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PartidaService {

    private final PartidaRepository partidaRepository;
    private final PartidaMapper partidaMapper;
    private final ApuestaRepository apuestaRepository;
    private final JugadorRepository jugadorRepository;
    private final TransaccionRepository transaccionRepository;
    private final ChatService chatService;

    public Optional<PartidaResponse> obtenerPorApuestaId(UUID apuestaId) {
        return partidaRepository.findByApuesta_Id(apuestaId).map(partidaMapper::toDto);
    }

    public Optional<UUID> obtenerChatActivo(UUID partidaId) {
        return partidaRepository.findById(partidaId)
                .filter(p -> p.getEstado() == EstadoPartida.EN_CURSO || p.getEstado() == EstadoPartida.POR_APROBAR)
                .map(Partida::getChatId);
    }

    @Transactional
    public PartidaResponse marcarComoValidada(UUID partidaId) {
        Partida partida = partidaRepository.findById(partidaId)
                .orElseThrow(() -> new IllegalArgumentException("Partida no encontrada"));
        partida.setValidada(true);
        partida.setValidadaEn(LocalDateTime.now());
        partida.setEstado(EstadoPartida.FINALIZADA);
        if (partida.getGanador() != null && partida.getApuesta() != null) {
            Apuesta apuesta = apuestaRepository.findById(partida.getApuesta().getId())
                    .orElseThrow(() -> new IllegalArgumentException("Apuesta no encontrada"));

            Transaccion premio = new Transaccion();
            premio.setJugador(partida.getGanador());
            premio.setMonto(apuesta.getMonto().multiply(java.math.BigDecimal.valueOf(2)));
            premio.setTipo(TipoTransaccion.PREMIO);
            premio.setEstado(EstadoTransaccion.APROBADA);
            premio.setCreadoEn(LocalDateTime.now());
            transaccionRepository.save(premio);

            jugadorRepository.findById(partida.getGanador().getId()).ifPresent(u -> {
                u.setSaldo(u.getSaldo().add(premio.getMonto()));
                jugadorRepository.save(u);
            });
        }

        chatService.cerrarChat(partida.getChatId());

        Partida saved = partidaRepository.save(partida);
        return partidaMapper.toDto(saved);
    }
}
