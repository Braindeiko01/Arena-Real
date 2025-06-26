package co.com.arena.real.infrastructure.mapper;

import co.com.arena.real.domain.entity.partida.Partida;
import co.com.arena.real.infrastructure.dto.rs.PartidaResponse;
import org.springframework.stereotype.Component;

@Component
public class PartidaMapper {

    public PartidaResponse toDto(Partida entity) {
        if (entity == null) {
            return null;
        }
        return PartidaResponse.builder()
                .id(entity.getId())
                .apuestaId(entity.getApuesta() != null ? entity.getApuesta().getId() : null)
                .ganadorId(entity.getGanador() != null ? entity.getGanador().getId() : null)
                .validada(entity.isValidada())
                .validadaEn(entity.getValidadaEn())
                .build();
    }
}