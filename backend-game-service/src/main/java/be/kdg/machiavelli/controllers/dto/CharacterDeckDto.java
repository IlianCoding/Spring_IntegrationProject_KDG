package be.kdg.machiavelli.controllers.dto;

import java.util.List;
import java.util.UUID;

public record CharacterDeckDto(UUID id, List<CharacterDto> characters) {
}