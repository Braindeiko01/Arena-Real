package co.com.arena.real.application.events;

import java.math.BigDecimal;

public record SaldoActualizadoEvent(String jugadorId, BigDecimal saldo) {
}
