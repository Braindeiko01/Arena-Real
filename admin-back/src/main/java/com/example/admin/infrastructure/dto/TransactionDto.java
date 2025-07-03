package com.example.admin.infrastructure.dto;

import lombok.Data;

import java.math.BigDecimal;
import java.util.UUID;

@Data
public class TransactionDto {
    private UUID id;
    private String playerId;
    private BigDecimal amount;
    private boolean approved;
}
