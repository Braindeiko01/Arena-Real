package co.com.arena.real.application.service;

import co.com.arena.real.domain.entity.Jugador;
import co.com.arena.real.infrastructure.dto.rq.JugadorRequest;
import co.com.arena.real.infrastructure.dto.rs.JugadorResponse;
import co.com.arena.real.infrastructure.exception.DuplicateUserException;
import co.com.arena.real.infrastructure.mapper.JugadorMapper;
import co.com.arena.real.infrastructure.repository.JugadorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class JugadorService {

    private final JugadorRepository jugadorRepository;
    private final JugadorMapper jugadorMapper;

    public JugadorResponse registrarJugador(JugadorRequest dto) {
        if (jugadorRepository.existsByEmail(dto.getEmail())) {
            throw new DuplicateUserException("El email ya está registrado");
        }

        if (jugadorRepository.existsByTelefono(dto.getTelefono())) {
            throw new DuplicateUserException("El teléfono ya está registrado");
        }
        // Mapeo de DTO A entidad
        Jugador jugador = jugadorMapper.toEntity(dto);
        Jugador saved = jugadorRepository.save(jugador);
        return jugadorMapper.toDto(saved);
    }

    public Optional<JugadorResponse> obtenerPorId(String id) {
        return jugadorRepository.findById(id)
                .map(jugadorMapper::toDto);
    }

}
