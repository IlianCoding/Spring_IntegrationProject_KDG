package be.kdg.machiavelli.controllers.dto;


import java.time.LocalDateTime;
import java.util.Set;
import java.util.UUID;

public record TurnDto(UUID id, Set<String> completedFases, boolean completed, LocalDateTime createdAt, RoundDto round, PlayerStateDto playerState, boolean hasDrawnBuilding, int amountOfBuildingsBuiltThisTurn, String notification) {
}