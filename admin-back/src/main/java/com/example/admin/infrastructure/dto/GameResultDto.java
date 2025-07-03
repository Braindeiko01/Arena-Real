package com.example.admin.infrastructure.dto;

import lombok.Data;

import java.util.UUID;

@Data
public class GameResultDto {
    private UUID id;
    private UUID winnerId;
    private boolean distributed;
}
