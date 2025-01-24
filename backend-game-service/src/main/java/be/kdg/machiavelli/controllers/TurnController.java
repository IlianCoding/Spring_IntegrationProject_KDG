package be.kdg.machiavelli.controllers;

import be.kdg.machiavelli.controllers.dto.BuildingDto;
import be.kdg.machiavelli.controllers.dto.TurnDto;
import be.kdg.machiavelli.services.DiscordService;
import be.kdg.machiavelli.services.TurnService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Set;
import java.util.UUID;

@RestController
@RequestMapping("/api/turns")
public class TurnController {
    private final TurnService turnService;
    private final DiscordService discordService;

    public TurnController(TurnService turnService, DiscordService discordService) {
        this.turnService = turnService;
        this.discordService = discordService;
    }

    @GetMapping("/{turnId}")
    @PreAuthorize("hasAuthority('player')")
    public TurnDto getTurn(@PathVariable UUID turnId) {
        return turnService.getTurn(turnId);
    }

    @PostMapping("/{turnId}/take-coins/{amount}/{isCharacterAbility}")
    @PreAuthorize("hasAuthority('player')")
    public TurnDto takeCoins(@PathVariable UUID turnId, @PathVariable int amount, @PathVariable boolean isCharacterAbility) {
        return turnService.takeCoins(turnId, amount, isCharacterAbility);
    }

    @GetMapping("/{turnId}/get-building-deck-size")
    @PreAuthorize("hasAuthority('player')")
    public int getBuildingDeckSize(@PathVariable UUID turnId) {
        return turnService.getRemainingCardsInBuildingDeck(turnId);
    }

    @GetMapping("/{turnId}/get-remaining-coins-in-bank")
    @PreAuthorize("hasAuthority('player')")
    public int getRemainingCoinsInBank(@PathVariable UUID turnId) {
        return turnService.getRemainingCoinsInBank(turnId);
    }

    @GetMapping("/{turnId}/completedFases")
    @PreAuthorize("hasAuthority('player')")
    public Set<String> getCompletedFases(@PathVariable UUID turnId) {
        return turnService.getCompletedFases(turnId).completedFases();
    }

    @PostMapping("/{turnId}/draw-buildings/{amount}/{isCharacterAbility}")
    @PreAuthorize("hasAuthority('player')")
    public List<BuildingDto> drawBuildings(@PathVariable UUID turnId, @PathVariable int amount, @PathVariable boolean isCharacterAbility) {
        return turnService.drawBuildings(turnId, amount, isCharacterAbility);
    }

    @PostMapping("/{turnId}/put-back-building")
    @PreAuthorize("hasAuthority('player')")
    public TurnDto putBackBuilding(@PathVariable UUID turnId, @RequestBody BuildingDto buildingToPutBack) {
        return turnService.putBackBuilding(turnId, buildingToPutBack);
    }

    @PostMapping("/{turnId}/build-building/{buildingId}")
    @PreAuthorize("hasAuthority('player')")
    public TurnDto buildBuilding(@PathVariable UUID turnId, @PathVariable UUID buildingId) {
        return turnService.buildBuilding(turnId, buildingId);
    }

    @GetMapping("/latest-turn/{gameId}")
    @PreAuthorize("hasAuthority('player')")
    public TurnDto findLatestTurn(@PathVariable UUID gameId) {
        return turnService.findLatestTurn(gameId);
    }

    @GetMapping("/latest-turn/{gameId}/{profileId}")
    @PreAuthorize("hasAuthority('player')")
    public TurnDto getLatestTurnByGameAndProfile(@PathVariable UUID gameId, @PathVariable UUID profileId) {
        return turnService.getLatestTurnByGameAndProfile(gameId, profileId);
    }

    @GetMapping("/is-players-turn/{gameId}/{profileId}")
    @PreAuthorize("hasAuthority('player')")
    public boolean isPlayersTurn(@PathVariable UUID gameId, @PathVariable UUID profileId) {
        return turnService.isPlayersTurn(gameId, profileId);
    }

    @GetMapping("/{turnId}/remaining-time")
    public long getRemainingTime(@PathVariable UUID turnId) {
        long remainingTime = turnService.getRemainingTime(turnId);
        if (remainingTime >= 120) {
            discordService.onTurn(turnService.getTurn(turnId).playerState().player().profile().discord(), "You have less than 2 minutes remaining to finish your turn!");
        }
        return remainingTime;
    }
}