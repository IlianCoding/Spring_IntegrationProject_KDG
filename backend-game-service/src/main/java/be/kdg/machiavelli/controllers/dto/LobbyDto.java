package be.kdg.machiavelli.controllers.dto;

import java.util.List;
import java.util.UUID;

public record LobbyDto(
        UUID id,
        boolean open,
        int number,
        List<ProfileDto> profiles,
        int averageLoyaltyPoints,
        UUID ownerId) {
}