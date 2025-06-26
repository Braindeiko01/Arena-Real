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
                .jugador1Id(entity.getJugador1() != null ? entity.getJugador1().getId() : null)
                .jugador2Id(entity.getJugador2() != null ? entity.getJugador2().getId() : null)
                .ganadorId(entity.getGanador() != null ? entity.getGanador().getId() : null)
                .modoJuego(entity.getModoJuego() != null ? entity.getModoJuego().name() : null)
                .estado(entity.getEstado() != null ? entity.getEstado().name() : null)
                .validada(entity.isValidada())
                .creada(entity.getCreada())
                .validadaEn(entity.getValidadaEn())
                .monto(entity.getApuesta() != null ? entity.getApuesta().getMonto() : null)
                .build();
    }
}