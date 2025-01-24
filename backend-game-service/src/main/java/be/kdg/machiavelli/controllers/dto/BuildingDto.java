package be.kdg.machiavelli.controllers.dto;

import be.kdg.machiavelli.domain.enums.Color;

import java.util.UUID;

public record BuildingDto(UUID id, String name, int cost, Color color, int number, String imgUrl) {
}
