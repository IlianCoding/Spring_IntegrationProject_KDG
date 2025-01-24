package be.kdg.machiavelli.controllers.dto;

import java.util.UUID;

public record SendInvitationDto(UUID sender, String receiver, UUID lobbyId, String url) {
}
