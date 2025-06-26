package co.com.arena.real.application.service;

import co.com.arena.real.domain.entity.Apuesta;
import co.com.arena.real.domain.entity.EstadoApuesta;
import co.com.arena.real.infrastructure.dto.rq.ApuestaRequest;
import co.com.arena.real.infrastructure.dto.rs.ApuestaResponse;
import co.com.arena.real.infrastructure.mapper.ApuestaMapper;
import co.com.arena.real.infrastructure.repository.ApuestaRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ApuestaService {

    private final ApuestaRepository apuestaRepository;

    @Transactional
    public Apuesta crearApuesta(@Valid ApuestaRequest dto) {
        Apuesta apuesta = ApuestaMapper.toEntity(dto);
        return apuestaRepository.save(apuesta);
    }

    public ApuestaResponse cambiarEstado(UUID id, EstadoApuesta estado) {
        Apuesta apuesta = apuestaRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Apuesta no encontrada"));
        apuesta.setEstado(estado);
        Apuesta saved = apuestaRepository.save(apuesta);
        return ApuestaMapper.toDto(saved);
    }
}
