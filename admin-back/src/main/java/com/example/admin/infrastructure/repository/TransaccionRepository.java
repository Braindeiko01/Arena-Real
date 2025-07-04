package com.example.admin.infrastructure.repository;

import com.example.admin.domain.entity.Transaccion;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface TransaccionRepository extends JpaRepository<Transaccion, UUID> {
    List<Transaccion> findByJugador_Id(String jugadorId);
    List<Transaccion> findByEstado(com.example.admin.domain.entity.EstadoTransaccion estado);
}
