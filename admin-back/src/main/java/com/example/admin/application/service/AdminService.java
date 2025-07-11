package com.example.admin.application.service;

import com.example.admin.infrastructure.dto.GameResultDto;
import com.example.admin.infrastructure.dto.ImageDto;
import com.example.admin.infrastructure.dto.TransactionDto;
import co.com.arena.real.domain.entity.EstadoApuesta;
import co.com.arena.real.domain.entity.EstadoTransaccion;
import co.com.arena.real.domain.entity.partida.EstadoPartida;
import co.com.arena.real.domain.entity.partida.Partida;
import co.com.arena.real.infrastructure.repository.ApuestaRepository;
import co.com.arena.real.infrastructure.repository.TransaccionRepository;
import co.com.arena.real.infrastructure.repository.PartidaRepository;
import co.com.arena.real.infrastructure.repository.JugadorRepository;
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
    private final JugadorRepository jugadorRepository;

    @Transactional(readOnly = true)
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

    @Transactional(readOnly = true)
    public List<TransactionDto> listTransactions() {
        return transaccionRepository.findAll().stream()
                .map(t -> {
                    TransactionDto dto = new TransactionDto();
                    dto.setId(t.getId());
                    dto.setPlayerId(t.getJugador().getId());
                    dto.setAmount(t.getMonto());
                    dto.setType(t.getTipo().name());
                    String estado = t.getEstado().name();
                    if (EstadoTransaccion.APROBADA.equals(t.getEstado())) {
                        estado = "ENTREGADA";
                    } else if (EstadoTransaccion.RECHAZADA.equals(t.getEstado())) {
                        estado = "CANCELADA";
                    }
                    dto.setStatus(estado);
                    dto.setCreatedAt(t.getCreadoEn());
                    dto.setReceipt(t.getComprobante());
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

    @Transactional
    public void changeTransactionStatus(UUID id, String status) {
        transaccionRepository.findById(id).ifPresent(t -> {
            EstadoTransaccion newStatus;
            if ("ENTREGADA".equalsIgnoreCase(status) || "APROBADA".equalsIgnoreCase(status)) {
                newStatus = EstadoTransaccion.APROBADA;
            } else if ("CANCELADA".equalsIgnoreCase(status) || "RECHAZADA".equalsIgnoreCase(status)) {
                newStatus = EstadoTransaccion.RECHAZADA;
            } else {
                newStatus = EstadoTransaccion.valueOf(status);
            }
            t.setEstado(newStatus);
            transaccionRepository.save(t);
        });
    }

    @Transactional(readOnly = true)
    public List<GameResultDto> listGameResults() {
        return partidaRepository.findByEstado(EstadoPartida.POR_APROBAR).stream()
                .map(p -> {
                    GameResultDto dto = new GameResultDto();
                    dto.setId(p.getId());
                    dto.setWinnerId(p.getGanador() != null ? UUID.fromString(p.getGanador().getId()) : null);
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
            p.setGanador(new co.com.arena.real.domain.entity.Jugador(playerId));
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
