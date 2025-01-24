package be.kdg.machiavelli.controllers.dto;

import java.util.List;

public record ActionDto(
        String executiveCharacterId,
        String targetCharacterId,
        String targetPlayerId,
        String executivePlayerId,
        boolean choice,
        List<String> buildingIdsToExchange,
        String gameId,
        String targetBuildingId,
        String turnId
) {
}
