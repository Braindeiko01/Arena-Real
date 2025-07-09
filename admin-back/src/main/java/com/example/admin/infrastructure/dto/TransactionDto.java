package com.example.admin.infrastructure.dto;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
public class TransactionDto {
    private UUID id;
    private String playerId;
    private BigDecimal amount;
    private String type;
    private String status;
    private LocalDateTime createdAt;
    private String receipt;
}
