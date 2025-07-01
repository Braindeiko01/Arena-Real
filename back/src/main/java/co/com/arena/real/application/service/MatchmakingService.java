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
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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

        return partidaEnEsperaRepository.findByModoJuegoAndMonto(partidaEnEspera.getModoJuego(), request.getMonto())
                .stream()
                .filter(p -> !p.getJugador().getId().equals(partidaEnEspera.getJugador().getId()))
                .filter(p -> {
                    String a = p.getJugador().getId();
                    String b = partidaEnEspera.getJugador().getId();
                    if (matchDeclineService.isDeclined(a, b) && Math.random() < 0.5) {
                        return false;
                    }
                    return true;
                })

                .findFirst() //todo: aquí debería estar la lógica para emparejar el matchmaking con personas del mismo nivel
                .map(partidaEncontrada -> {

                    Jugador jugadorEncontrado = jugadorRepository.findById(partidaEncontrada.getJugador().getId())
                            .orElseThrow(() -> new IllegalArgumentException("Jugador en espera no encontrado"));

                    if (!(jugadorEncontrado.getSaldo().compareTo(partidaEncontrada.getMonto()) >= 0)) {
                        throw new IllegalArgumentException("Saldo insuficiente para realizar esta operación");
                    }

                    cancelarSolicitudes(jugadorEnEspera);
                    cancelarSolicitudes(jugadorEncontrado);

                    MatchProposal proposal = crearPropuesta(partidaEnEspera, partidaEncontrada);

                    matchSseService.notifyMatchFound(null, proposal.getId(), jugadorEnEspera, jugadorEncontrado);

                    return proposal;
                });
    }

    private void cancelarSolicitudes(Jugador jugador) {
        partidaEnEsperaRepository.deleteByJugador(jugador);
    }

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

}
