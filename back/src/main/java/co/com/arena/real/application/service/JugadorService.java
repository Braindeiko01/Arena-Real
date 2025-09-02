package co.com.arena.real.application.service;

import co.com.arena.real.domain.entity.Jugador;
import co.com.arena.real.infrastructure.dto.rq.JugadorRequest;
import co.com.arena.real.infrastructure.dto.rs.JugadorResponse;
import co.com.arena.real.infrastructure.exception.DuplicateUserException;
import co.com.arena.real.infrastructure.mapper.JugadorMapper;
import co.com.arena.real.infrastructure.repository.JugadorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class JugadorService {

    private final JugadorRepository jugadorRepository;
    private final JugadorMapper jugadorMapper;
    private final SseService sseService;

    public JugadorResponse registrarJugador(JugadorRequest dto) {
        if (jugadorRepository.existsByEmail(dto.getEmail())) {
            throw new DuplicateUserException("El email ya está registrado");
        }

        if (jugadorRepository.existsByTelefono(dto.getTelefono())) {
            throw new DuplicateUserException("El teléfono ya está registrado");
        }
        // Mapeo de DTO A entidad
        Jugador jugador = jugadorMapper.toEntity(dto);
        jugador.setReferralCode(java.util.UUID.randomUUID().toString());
        Jugador invitador = null;
        if (dto.getReferralCode() != null && !dto.getReferralCode().isBlank()) {
            invitador = jugadorRepository.findByReferralCode(dto.getReferralCode()).orElse(null);
            if (invitador != null) {
                jugador.setReferredBy(invitador.getId());
            }
        }
        Jugador saved = jugadorRepository.save(jugador);
        if (invitador != null) {
            Map<String, String> payload = Map.of(
                    "id", saved.getId(),
                    "nombre", saved.getNombre()
            );
            sseService.sendEvent(invitador.getId(), "referral-registered", payload);
        }
        return jugadorMapper.toDto(saved);
    }

    public Optional<JugadorResponse> obtenerPorId(String id) {
        return jugadorRepository.findById(id)
                .map(jugadorMapper::toDto);
    }

    public Optional<BigDecimal> obtenerSaldo(String id) {
        return jugadorRepository.findById(id)
                .map(Jugador::getSaldo);
    }

}
