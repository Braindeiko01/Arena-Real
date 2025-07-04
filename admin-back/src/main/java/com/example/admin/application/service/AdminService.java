package com.example.admin.application.service;

import com.example.admin.infrastructure.dto.GameResultDto;
import com.example.admin.infrastructure.dto.ImageDto;
import com.example.admin.infrastructure.dto.TransactionDto;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.UUID;

@Service
public class AdminService {

    public List<ImageDto> listPendingImages() {
        // TODO connect to database and fetch real data
        return Collections.emptyList();
    }

    public void approveImage(UUID id) {
        // TODO update image status in database
    }

    public List<TransactionDto> listPendingTransactions() {
        // TODO connect to database and fetch real data
        return Collections.emptyList();
    }

    public void approveTransaction(UUID id) {
        // TODO update transaction status in database
    }

    public List<GameResultDto> listGameResults() {
        // TODO connect to database and fetch real data
        return Collections.emptyList();
    }

    public void distributePrize(UUID gameId) {
        // TODO distribute prize in database
    }

    public void assignWinner(UUID gameId, String playerId) {
        // TODO update winner in database
    }

    public void changeBetState(UUID betId, String state) {
        // TODO update bet state in database
    }
}
