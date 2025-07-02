package co.com.arena.real.application.service;

import co.com.arena.real.domain.entity.matchmaking.MatchProposal;
import co.com.arena.real.domain.entity.partida.EstadoPartida;
import co.com.arena.real.domain.entity.partida.Partida;
import co.com.arena.real.infrastructure.repository.MatchProposalRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class MatchProposalService {

    private final MatchProposalRepository matchProposalRepository;
    private final MatchSseService matchSseService;

    public Optional<Partida> aceptarPropuesta(UUID partidaId, String jugadorId) {
        MatchProposal proposal = matchProposalRepository.findByIdForUpdate(partidaId)
                .orElseThrow(() -> new IllegalArgumentException("Partida no encontrada"));

        if (proposal.getJugador1() != null && jugadorId.equals(proposal.getJugador1().getId())) {
            proposal.setAceptadoJugador1(true);
            matchSseService.notifyOpponentAccepted(
                    null,
                    proposal.getId(),
                    proposal.getJugador1(),
                    proposal.getJugador2());
        } else if (proposal.getJugador2() != null && jugadorId.equals(proposal.getJugador2().getId())) {
            proposal.setAceptadoJugador2(true);
            matchSseService.notifyOpponentAccepted(
                    null,
                    proposal.getId(),
                    proposal.getJugador2(),
                    proposal.getJugador1());
        } else {
            throw new IllegalArgumentException("Jugador no pertenece a la partida");
        }

        if (proposal.isAceptadoJugador1() && proposal.isAceptadoJugador2()) {
            Partida partida = Partida.builder()
                    .id(proposal.getId())
                    .jugador1(proposal.getJugador1())
                    .jugador2(proposal.getJugador2())
                    .modoJuego(proposal.getModoJuego())
                    .estado(EstadoPartida.PENDIENTE)
                    .creada(LocalDateTime.now())
                    .monto(proposal.getMonto())
                    .aceptadoJugador1(true)
                    .aceptadoJugador2(true)
                    .build();
            matchProposalRepository.delete(proposal);
            return Optional.of(partida);
        }
        matchProposalRepository.save(proposal);
        return Optional.empty();
    }

    public Partida crearPartidaDesdePropuesta(MatchProposal proposal) {
        return Partida.builder()
                .id(proposal.getId())
                .jugador1(proposal.getJugador1())
                .jugador2(proposal.getJugador2())
                .modoJuego(proposal.getModoJuego())
                .estado(EstadoPartida.PENDIENTE)
                .monto(proposal.getMonto())
                .aceptadoJugador1(proposal.isAceptadoJugador1())
                .aceptadoJugador2(proposal.isAceptadoJugador2())
                .build();
    }
}
