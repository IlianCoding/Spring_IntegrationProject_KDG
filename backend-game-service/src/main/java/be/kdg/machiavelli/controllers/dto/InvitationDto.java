package be.kdg.machiavelli.controllers.dto;

import be.kdg.machiavelli.domain.Profile;

import java.util.UUID;

public record InvitationDto(UUID id, Profile sender, Profile receiver, UUID lobbyId, boolean accepted, String url) {
}
