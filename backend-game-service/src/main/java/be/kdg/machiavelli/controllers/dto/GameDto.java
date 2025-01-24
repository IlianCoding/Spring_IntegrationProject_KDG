package be.kdg.machiavelli.controllers.dto;

import com.fasterxml.jackson.annotation.JsonFormat;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public record GameDto(
        UUID id,
        int turnDuration,
        @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
        LocalDateTime startTime,
        @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
        LocalDateTime endTime,
        int coinsInBank,
        int numberOfRounds,
        boolean completed,
        PlayerDto winner,
        LobbyDto lobby,
        List<PlayerStateDto> playerStates,
        BuildingDeckDto buildingDeck
) {
}
