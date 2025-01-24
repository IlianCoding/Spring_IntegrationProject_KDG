package be.kdg.machiavelli.controllers.dto;

import be.kdg.machiavelli.domain.enums.GimmickType;

import java.util.UUID;

public record GimmickDto(UUID id, String name, int numberOfLoyaltyPoints, GimmickType type) {
}