package be.kdg.machiavelli.controllers.dto;

import java.util.UUID;

public record TournamentDto(UUID id, Boolean open, String name, TournamentSettingsDto settings) {
}
