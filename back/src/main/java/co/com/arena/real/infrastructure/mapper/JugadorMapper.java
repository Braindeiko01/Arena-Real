package co.com.arena.real.infrastructure.mapper;

import co.com.arena.real.domain.entity.Jugador;
import co.com.arena.real.infrastructure.dto.rq.JugadorRequest;
import co.com.arena.real.infrastructure.dto.rs.JugadorResponse;
import org.springframework.stereotype.Component;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Component
public class JugadorMapper {

    private static final Pattern TAG_PATTERN = Pattern.compile("tag=([^&]+)");

    public JugadorResponse toDto(Jugador jugador) {
        if (jugador == null) {
            return null;
        }
        return JugadorResponse.builder()
                .id(jugador.getId())
                .nombre(jugador.getNombre())
                .email(jugador.getEmail())
                .telefono(jugador.getTelefono())
                .tagClash(jugador.getTagClash())
                .linkAmistad(jugador.getLinkAmistad())
                .saldo(jugador.getSaldo())
                .reputacion(jugador.getReputacion())
                .build();
    }

    public Jugador toEntity(JugadorRequest dto) {
        if (dto == null) {
            return null;
        }

        return Jugador.builder()
                .id(dto.getId())
                .nombre(dto.getNombre())
                .email(dto.getEmail())
                .telefono(dto.getTelefono())
                .tagClash(extractTagFromUrl(dto.getLinkAmistad()))
                .linkAmistad(dto.getLinkAmistad())
                .build();
    }

    public static String extractTagFromUrl(String url) {

        Matcher matcher = TAG_PATTERN.matcher(url);
        if (matcher.find()) {
            return matcher.group(1);
        }

        return null;
    }


}
