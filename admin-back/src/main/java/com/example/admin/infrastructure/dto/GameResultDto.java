package com.example.admin.infrastructure.dto;

import lombok.Data;

import java.util.UUID;

@Data
public class GameResultDto {
    private UUID id;
    private String jugadorA;
    private String jugadorB;
    private String estado;
    private String capturaA;
    private String capturaB;
    private UUID winnerId;
    private boolean distributed;
}
