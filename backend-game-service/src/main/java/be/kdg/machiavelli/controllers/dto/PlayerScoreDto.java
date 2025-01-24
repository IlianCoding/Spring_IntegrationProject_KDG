package be.kdg.machiavelli.controllers.dto;

import com.fasterxml.jackson.annotation.JsonFormat;

import java.time.LocalDateTime;
import java.util.UUID;

public record PlayerScoreDto(UUID playerId, String userName, UUID gameId, @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss") LocalDateTime gameDate, int score, UUID profileId) {
}
