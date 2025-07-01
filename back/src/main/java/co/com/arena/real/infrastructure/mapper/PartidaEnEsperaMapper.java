package co.com.arena.real.infrastructure.mapper;

import co.com.arena.real.domain.entity.Jugador;
import co.com.arena.real.domain.entity.partida.PartidaEnEspera;
import co.com.arena.real.infrastructure.dto.rq.PartidaEnEsperaRequest;
import java.time.LocalDateTime;

public final class PartidaEnEsperaMapper {

    private PartidaEnEsperaMapper() {
    }

    public static PartidaEnEspera toEntity(PartidaEnEsperaRequest request) {
        return PartidaEnEspera.builder()
                .jugador(new Jugador(request.getJugadorId()))
                .modoJuego(request.getModoJuego())
                .monto(request.getMonto())
                .creadaEn(LocalDateTime.now())
                .build();
    }


}
