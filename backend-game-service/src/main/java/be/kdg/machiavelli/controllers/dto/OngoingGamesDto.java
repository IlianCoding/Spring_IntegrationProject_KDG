package be.kdg.machiavelli.controllers.dto;

import java.util.List;
import java.util.UUID;

public record OngoingGamesDto(UUID gameId, UUID lobbyId, List<PlayerDto> players, PlayerDto playerWithCurrentTurn, int duration) {
}
