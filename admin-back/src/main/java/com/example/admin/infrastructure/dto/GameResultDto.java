package com.example.admin.infrastructure.dto;

import lombok.Data;

import java.util.UUID;

@Data
public class GameResultDto {
    private UUID id;
    private String jugadorAId;
    private String jugadorA;
    private String jugadorATag;
    private String jugadorBId;
    private String jugadorB;
    private String jugadorBTag;
    private String estado;
    private String capturaA;
    private String capturaB;
    private String resultadoA;
    private String resultadoB;
    private java.math.BigDecimal monto;
    private UUID winnerId;
    private boolean distributed;
}
