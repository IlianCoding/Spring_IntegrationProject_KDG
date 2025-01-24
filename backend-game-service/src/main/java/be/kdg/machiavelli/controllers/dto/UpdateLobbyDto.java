package be.kdg.machiavelli.controllers.dto;

import java.util.UUID;

public record UpdateLobbyDto(UUID lobbyId, UUID profileId) {
}
