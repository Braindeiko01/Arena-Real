package com.example.admin.infrastructure.repository;

import com.example.admin.domain.entity.Jugador;
import org.springframework.data.jpa.repository.JpaRepository;

public interface JugadorRepository extends JpaRepository<Jugador, String> {
    boolean existsByEmail(String email);

    boolean existsByTelefono(String telefono);

}
