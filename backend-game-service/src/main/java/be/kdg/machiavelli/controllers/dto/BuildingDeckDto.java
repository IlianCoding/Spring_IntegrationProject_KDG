package be.kdg.machiavelli.controllers.dto;

import java.util.List;
import java.util.UUID;

public record BuildingDeckDto(UUID id, List<BuildingDto> buildings) {
}
