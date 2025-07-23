package co.com.arena.real.application.service;

import co.com.arena.real.domain.entity.partida.EstadoPartida;
import co.com.arena.real.domain.entity.Jugador;
import co.com.arena.real.domain.entity.partida.ModoJuego;
import co.com.arena.real.domain.entity.partida.PartidaEnEspera;
import co.com.arena.real.domain.entity.matchmaking.MatchProposal;
import co.com.arena.real.infrastructure.dto.rq.PartidaEnEsperaRequest;
import co.com.arena.real.infrastructure.mapper.PartidaEnEsperaMapper;
import co.com.arena.real.infrastructure.repository.JugadorRepository;
import co.com.arena.real.infrastructure.repository.PartidaEnEsperaRepository;
import co.com.arena.real.infrastructure.repository.PartidaRepository;
import co.com.arena.real.infrastructure.repository.MatchProposalRepository;
import co.com.arena.real.application.service.MatchSseService;
import co.com.arena.real.application.service.MatchDeclineService;
import co.com.arena.real.websocket.MatchWsService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class MatchmakingService {

    private final PartidaEnEsperaRepository partidaEnEsperaRepository;
    private final JugadorRepository jugadorRepository;
    private final PartidaRepository partidaRepository;
    private final MatchProposalRepository matchProposalRepository;
    private final MatchSseService matchSseService;
    private final MatchWsService matchWsService;
    private final MatchDeclineService matchDeclineService;

    private static final List<ModoJuego> PRIORIDAD_MODO_JUEGO = List.of(
            ModoJuego.TRIPLE_ELECCION,
            ModoJuego.CLASICO
    );

    @Transactional
    public Optional<MatchProposal> intentarEmparejar(PartidaEnEsperaRequest request) {
        Jugador jugadorEnEspera = jugadorRepository.findById(request.getJugadorId())
                .orElseThrow(() -> new IllegalArgumentException("Jugador no encontrado"));

        if (!(jugadorEnEspera.getSaldo().compareTo(request.getMonto()) >= 0)) {
            throw new IllegalArgumentException("Saldo insuficiente para realizar esta operación");
        }

        if (partidaRepository.existsActiveByJugador(
                jugadorEnEspera.getId(),
                List.of(EstadoPartida.EN_CURSO, EstadoPartida.POR_APROBAR))) {

            throw new IllegalArgumentException("El jugador ya tiene una partida en curso");

        }

        cancelarSolicitudes(jugadorEnEspera);

        PartidaEnEspera partidaEnEsperaRq = PartidaEnEsperaMapper.toEntity(request);
        PartidaEnEspera partidaEnEspera = partidaEnEsperaRepository.save(partidaEnEsperaRq);

        return buscarPareja(partidaEnEspera).map(partidaEncontrada -> {

            Jugador jugadorEncontrado = jugadorRepository.findById(partidaEncontrada.getJugador().getId())
                    .orElseThrow(() -> new IllegalArgumentException("Jugador en espera no encontrado"));

            if (!(jugadorEncontrado.getSaldo().compareTo(partidaEncontrada.getMonto()) >= 0)) {
                throw new IllegalArgumentException("Saldo insuficiente para realizar esta operación");
            }

            cancelarSolicitudes(jugadorEnEspera);
            cancelarSolicitudes(jugadorEncontrado);

            MatchProposal proposal = crearPropuesta(partidaEnEspera, partidaEncontrada);

            matchSseService.notifyMatchFound(null, proposal.getId(), jugadorEnEspera, jugadorEncontrado);
            matchWsService.notifyMatchFound(null, proposal.getId(), jugadorEnEspera, jugadorEncontrado);

            return proposal;
        });
    }

    private void cancelarSolicitudes(Jugador jugador) {
        partidaEnEsperaRepository.deleteByJugador(jugador);
    }

    @Transactional
    public void cancelarSolicitudes(String jugadorId) {
        partidaEnEsperaRepository.deleteByJugador(new Jugador(jugadorId));
    }

    private MatchProposal crearPropuesta(PartidaEnEspera partidaEnEspera, PartidaEnEspera partidaEncontrada) {
        Jugador jugador1 = jugadorRepository.findById(partidaEnEspera.getJugador().getId())
                .orElseThrow(() -> new IllegalArgumentException("Jugador no encontrado"));
        Jugador jugador2 = jugadorRepository.findById(partidaEncontrada.getJugador().getId())
                .orElseThrow(() -> new IllegalArgumentException("Jugador no encontrado"));

        MatchProposal proposal = MatchProposal.builder()
                .jugador1(jugador1)
                .jugador2(jugador2)
                .modoJuego(partidaEnEspera.getModoJuego())
                .monto(partidaEnEspera.getMonto())
                .build();

        return matchProposalRepository.save(proposal);
    }

    private Optional<PartidaEnEspera> buscarPareja(PartidaEnEspera partidaEnEspera) {
        // 1. Buscar mismo modo y monto
        return partidaEnEsperaRepository
                .findByModoJuegoAndMontoOrderByCreadaEnAsc(partidaEnEspera.getModoJuego(), partidaEnEspera.getMonto())
                .stream()
                .filter(p -> !p.getJugador().getId().equals(partidaEnEspera.getJugador().getId()))
                .filter(p -> filtrarDeclinados(p, partidaEnEspera))
                .findFirst()
                .or(() -> {
                    // 2. Desesperación: mismo modo
                    return partidaEnEsperaRepository
                            .findByModoJuegoOrderByCreadaEnAsc(partidaEnEspera.getModoJuego())
                            .stream()
                            .filter(p -> !p.getJugador().getId().equals(partidaEnEspera.getJugador().getId()))
                            .filter(p -> filtrarDeclinados(p, partidaEnEspera))
                            .filter(p -> Duration.between(p.getCreadaEn(), LocalDateTime.now()).toSeconds() > 30)
                            .findFirst();
                })
                .or(() -> {
                    // 3. Cualquier modo para candidatos esperando > 60s
                    return partidaEnEsperaRepository
                            .findAllByOrderByCreadaEnAsc()
                            .stream()
                            .filter(p -> !p.getJugador().getId().equals(partidaEnEspera.getJugador().getId()))
                            .filter(p -> filtrarDeclinados(p, partidaEnEspera))
                            .filter(p -> Duration.between(p.getCreadaEn(), LocalDateTime.now()).toSeconds() > 60)
                            .findFirst();
                });
    }

    private boolean filtrarDeclinados(PartidaEnEspera a, PartidaEnEspera b) {
        String idA = a.getJugador().getId();
        String idB = b.getJugador().getId();
        return !(matchDeclineService.isDeclined(idA, idB) && Math.random() < 0.5);
    }

//    @Transactional
//    @org.springframework.scheduling.annotation.Scheduled(fixedRate = 60000)
//    public void limpiarSolicitudesAntiguas() {
//        LocalDateTime threshold = LocalDateTime.now().minusMinutes(10);
//        partidaEnEsperaRepository.deleteByCreadaEnBefore(threshold);
//    }

}
