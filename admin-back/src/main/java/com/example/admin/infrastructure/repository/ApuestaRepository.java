package com.example.admin.infrastructure.repository;

import com.example.admin.domain.entity.Apuesta;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface ApuestaRepository extends JpaRepository<Apuesta, UUID> {
}
