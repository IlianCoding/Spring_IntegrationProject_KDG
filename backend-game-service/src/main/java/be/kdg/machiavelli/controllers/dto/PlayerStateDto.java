package be.kdg.machiavelli.controllers.dto;

import java.util.List;
import java.util.UUID;

public record PlayerStateDto(
        UUID id,
        int score,
        int numberOfCoins,
        boolean assassinated,
        boolean isKing,
        int number,
        PlayerDto player,
        List<CharacterDto> characters,
        List<CharacterDto> charactersThatHavePlayed,
        List<BuildingDto> buildingsBuilt,
        List<BuildingDto> buildingsInHand,
        String notification,
        boolean firstToEightBuildings,
        boolean hasEightOrMoreBuildings

) {
}