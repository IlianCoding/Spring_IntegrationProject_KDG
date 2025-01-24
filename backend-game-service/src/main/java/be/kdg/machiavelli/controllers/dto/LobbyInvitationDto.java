package be.kdg.machiavelli.controllers.dto;

import java.util.UUID;

public record LobbyInvitationDto(LobbyDto lobby, UUID profileId) {
}
