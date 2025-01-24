package be.kdg.machiavelli.controllers.dto;

import be.kdg.machiavelli.domain.enums.Color;

import java.util.UUID;

public record CharacterDto(UUID id, String name, Color color, int number, boolean hasPlayedThisRound, String image, String description) {
}
