package com.example.admin.application.service;

import com.example.admin.infrastructure.dto.GameResultDto;
import com.example.admin.infrastructure.dto.ImageDto;
import com.example.admin.infrastructure.dto.TransactionDto;
import com.example.admin.domain.entity.EstadoApuesta;
import com.example.admin.domain.entity.EstadoTransaccion;
import com.example.admin.domain.entity.partida.EstadoPartida;
import com.example.admin.domain.entity.partida.Partida;
import com.example.admin.infrastructure.repository.ApuestaRepository;
import com.example.admin.infrastructure.repository.TransaccionRepository;
import com.example.admin.infrastructure.repository.PartidaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final PartidaRepository partidaRepository;
    private final TransaccionRepository transaccionRepository;
    private final ApuestaRepository apuestaRepository;

    public List<ImageDto> listPendingImages() {
        return partidaRepository.findByEstado(EstadoPartida.POR_APROBAR).stream()
                .flatMap(p -> java.util.stream.Stream.of(p.getCapturaJugador1(), p.getCapturaJugador2())
                        .filter(java.util.Objects::nonNull)
                        .map(img -> {
                            ImageDto dto = new ImageDto();
                            dto.setId(p.getId());
                            dto.setBase64(img);
                            dto.setApproved(p.isValidada());
                            return dto;
                        }))
                .toList();
    }

    @Transactional
    public void approveImage(UUID id) {
        partidaRepository.findById(id).ifPresent(p -> {
            p.setValidada(true);
            p.setEstado(EstadoPartida.FINALIZADA);
            partidaRepository.save(p);
        });
    }

    public List<TransactionDto> listPendingTransactions() {
        return transaccionRepository.findByEstado(EstadoTransaccion.PENDIENTE).stream()
                .map(t -> {
                    TransactionDto dto = new TransactionDto();
                    dto.setId(t.getId());
                    dto.setPlayerId(t.getJugador().getId());
                    dto.setAmount(t.getMonto());
                    dto.setApproved(EstadoTransaccion.APROBADA.equals(t.getEstado()));
                    return dto;
                })
                .toList();
    }

    @Transactional
    public void approveTransaction(UUID id) {
        transaccionRepository.findById(id).ifPresent(t -> {
            t.setEstado(EstadoTransaccion.APROBADA);
            transaccionRepository.save(t);
        });
    }

    public List<GameResultDto> listGameResults() {
        return partidaRepository.findByEstado(EstadoPartida.FINALIZADA).stream()
                .map(p -> {
                    GameResultDto dto = new GameResultDto();
                    dto.setId(p.getId());
                    dto.setWinnerId(p.getGanador() != null ? p.getGanador().getId() : null);
                    dto.setDistributed(p.isValidada());
                    return dto;
                })
                .toList();
    }

    @Transactional
    public void distributePrize(UUID gameId) {
        partidaRepository.findById(gameId).ifPresent(p -> {
            p.setValidada(true);
            p.setEstado(EstadoPartida.FINALIZADA);
            partidaRepository.save(p);
        });
    }

    @Transactional
    public void assignWinner(UUID gameId, String playerId) {
        partidaRepository.findById(gameId).ifPresent(p -> {
            p.setGanador(new com.example.admin.domain.entity.Jugador(playerId));
            partidaRepository.save(p);
        });
    }

    @Transactional
    public void changeBetState(UUID betId, String state) {
        apuestaRepository.findById(betId).ifPresent(a -> {
            a.setEstado(EstadoApuesta.valueOf(state));
            apuestaRepository.save(a);
        });
    }
}
