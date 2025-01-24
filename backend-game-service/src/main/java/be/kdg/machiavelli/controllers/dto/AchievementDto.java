package be.kdg.machiavelli.controllers.dto;

import java.util.UUID;

public record AchievementDto(UUID id, String name, int numberOfLoyaltyPoints, String description) {
}