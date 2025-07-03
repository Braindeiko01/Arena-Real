package co.com.arena.real.application.service;

import co.com.arena.real.domain.entity.Apuesta;
import co.com.arena.real.domain.entity.EstadoTransaccion;
import co.com.arena.real.domain.entity.TipoTransaccion;
import co.com.arena.real.domain.entity.Transaccion;
import co.com.arena.real.domain.entity.partida.Partida;
import co.com.arena.real.domain.entity.partida.ResultadoJugador;
import co.com.arena.real.infrastructure.dto.rs.PartidaResponse;
import co.com.arena.real.infrastructure.dto.rq.PartidaResultadoRequest;
import co.com.arena.real.infrastructure.dto.rq.ApuestaRequest;
import co.com.arena.real.infrastructure.dto.rq.TransaccionRequest;
import co.com.arena.real.infrastructure.dto.rs.TransaccionResponse;
import co.com.arena.real.infrastructure.mapper.PartidaMapper;
import co.com.arena.real.infrastructure.repository.ApuestaRepository;
import co.com.arena.real.infrastructure.repository.JugadorRepository;
import co.com.arena.real.infrastructure.repository.PartidaRepository;
import co.com.arena.real.infrastructure.repository.TransaccionRepository;
import co.com.arena.real.infrastructure.repository.MatchProposalRepository;
import co.com.arena.real.domain.entity.matchmaking.MatchProposal;
import co.com.arena.real.domain.entity.partida.EstadoPartida;
import co.com.arena.real.application.service.ChatService;
import co.com.arena.real.application.service.ApuestaService;
import co.com.arena.real.application.service.TransaccionService;
import co.com.arena.real.application.service.MatchProposalService;
import co.com.arena.real.application.service.MatchService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
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
    private final MatchProposalRepository matchProposalRepository;
    private final ChatService chatService;
    private final ApuestaService apuestaService;
    private final TransaccionService transaccionService;
    private final MatchProposalService matchProposalService;
    private final MatchService matchService;

    private static final Logger log = LoggerFactory.getLogger(PartidaService.class);

    public Optional<PartidaResponse> obtenerPorApuestaId(UUID apuestaId) {
        return partidaRepository.findByApuesta_Id(apuestaId).map(partidaMapper::toDto);
    }

    public java.util.List<PartidaResponse> listarHistorial(String jugadorId) {
        return partidaRepository.findByJugadorAndEstado(jugadorId, EstadoPartida.FINALIZADA)
                .stream()
                .map(partidaMapper::toDto)
                .toList();
    }

    public Optional<UUID> obtenerChatActivo(UUID partidaId) {
        return partidaRepository.findById(partidaId)
                .filter(p -> p.getEstado() == EstadoPartida.EN_CURSO || p.getEstado() == EstadoPartida.POR_APROBAR)
                .map(Partida::getChatId);
    }

    public Optional<PartidaResponse> obtenerPorChatId(UUID chatId) {
        return partidaRepository.findByChatId(chatId).map(partidaMapper::toDto);
    }

    @Transactional
    public PartidaResponse aceptarPartida(UUID partidaId, String jugadorId) {
        Partida partida = partidaRepository.findByIdForUpdate(partidaId).orElse(null);
        if (partida == null) {
            java.util.Optional<Partida> maybe = matchProposalService.aceptarPropuesta(partidaId, jugadorId);
            if (maybe.isPresent()) {
                partida = maybe.get();
                matchService.procesarSiListo(partida);
            } else {
                MatchProposal updated = matchProposalRepository.findById(partidaId)
                        .orElseThrow(() -> new IllegalArgumentException("Partida no encontrada"));
                return partidaMapper.toDto(matchProposalService.crearPartidaDesdePropuesta(updated));
            }
        } else {
            matchService.aceptar(partida, jugadorId);
            matchService.procesarSiListo(partida);
        }

        Partida saved = partidaRepository.save(partida);
        return partidaMapper.toDto(saved);
    }


    @Transactional
    public PartidaResponse reportarResultado(UUID partidaId, PartidaResultadoRequest dto) {
        Partida partida = partidaRepository.findByIdForUpdate(partidaId)
                .orElseThrow(() -> new IllegalArgumentException("Partida no encontrada"));

        if (partida.isValidada() || partida.getEstado() == EstadoPartida.FINALIZADA) {
            throw new IllegalStateException("La partida ya está finalizada");
        }

        if (partida.getJugador1() != null && partida.getJugador1().getId().equals(dto.getJugadorId())) {
            partida.setResultadoJugador1(ResultadoJugador.valueOf(dto.getResultado()));
            partida.setCapturaJugador1(dto.getCaptura());
        } else if (partida.getJugador2() != null && partida.getJugador2().getId().equals(dto.getJugadorId())) {
            partida.setResultadoJugador2(ResultadoJugador.valueOf(dto.getResultado()));
            partida.setCapturaJugador2(dto.getCaptura());
        } else {
            throw new IllegalArgumentException("Jugador no pertenece a la partida");
        }

        partida.setEstado(EstadoPartida.POR_APROBAR);

        Partida saved = partidaRepository.save(partida);
        return partidaMapper.toDto(saved);
    }

    @Transactional
    public PartidaResponse asignarGanador(UUID partidaId, String jugadorId) {
        Partida partida = partidaRepository.findByIdForUpdate(partidaId)
                .orElseThrow(() -> new IllegalArgumentException("Partida no encontrada"));

        co.com.arena.real.domain.entity.Jugador jugador = jugadorRepository.findById(jugadorId)
                .orElseThrow(() -> new IllegalArgumentException("Jugador no encontrado"));

        partida.setGanador(jugador);
        partida.setEstado(EstadoPartida.FINALIZADA);

        Partida saved = partidaRepository.save(partida);
        return partidaMapper.toDto(saved);
    }

    @Transactional
    public PartidaResponse marcarComoValidada(UUID partidaId) {
        Partida partida = partidaRepository.findByIdForUpdate(partidaId)
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
  
    @Transactional
    public PartidaResponse cancelarPartida(UUID partidaId) {
        Partida partida = partidaRepository.findByIdForUpdate(partidaId)
                .orElseThrow(() -> new IllegalArgumentException("Partida no encontrada"));

        if (partida.getEstado() == EstadoPartida.CANCELADA || partida.getEstado() == EstadoPartida.FINALIZADA) {
            throw new IllegalStateException("La partida ya está finalizada");
        }

        partida.setEstado(EstadoPartida.CANCELADA);

        if (partida.getApuesta() != null) {
            Apuesta apuesta = apuestaRepository.findById(partida.getApuesta().getId())
                    .orElseThrow(() -> new IllegalArgumentException("Apuesta no encontrada"));
            apuesta.setEstado(co.com.arena.real.domain.entity.EstadoApuesta.CANCELADA);
            apuestaRepository.save(apuesta);

            registrarReembolso(partida.getJugador1(), apuesta.getMonto());
            registrarReembolso(partida.getJugador2(), apuesta.getMonto());
        }

        chatService.cerrarChat(partida.getChatId());

        Partida saved = partidaRepository.save(partida);
        return partidaMapper.toDto(saved);
    }

    private void registrarReembolso(co.com.arena.real.domain.entity.Jugador jugador, java.math.BigDecimal monto) {
        if (jugador == null) {
            return;
        }
        Transaccion reembolso = new Transaccion();
        reembolso.setJugador(jugador);
        reembolso.setMonto(monto);
        reembolso.setTipo(TipoTransaccion.REEMBOLSO);
        reembolso.setEstado(EstadoTransaccion.APROBADA);
        reembolso.setCreadoEn(LocalDateTime.now());
        transaccionRepository.save(reembolso);

        jugadorRepository.findById(jugador.getId()).ifPresent(u -> {
            u.setSaldo(u.getSaldo().add(monto));
            jugadorRepository.save(u);
        });
    }

}
