package be.kdg.machiavelli.controllers.dto;

import java.util.UUID;

public record PlayerDto(UUID id, ProfileDto profile, int number, PlayerStateDto playerStateDto) {
}
