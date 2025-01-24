package be.kdg.machiavelli.services;

import be.kdg.machiavelli.controllers.dto.LobbyDto;
import be.kdg.machiavelli.domain.BuildingDeck;
import be.kdg.machiavelli.domain.Game;
import be.kdg.machiavelli.domain.Round;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
public class LobbySetupService {
    private final LobbyService lobbyService;
    private final GameService gameService;
    private final BuildingDeckService buildingDeckService;
    private final RoundTurnService roundTurnService;


    public LobbySetupService(LobbyService lobbyService, GameService gameService, BuildingDeckService buildingDeckService, RoundTurnService roundTurnService) {
        this.lobbyService = lobbyService;
        this.gameService = gameService;
        this.buildingDeckService = buildingDeckService;
        this.roundTurnService = roundTurnService;
    }

    @Transactional
    public LobbyDto startGame(UUID lobbyId) {
        LobbyDto lobbyDto = lobbyService.startLobbyGame(lobbyId);
        Game latestGame = gameService.findTopByLobbyOrderByStartTimeDesc(lobbyService.findById(lobbyId));
        latestGame = createAndAddBuildingDeck(latestGame);
        latestGame = gameService.initializePlayerStates(latestGame);
        Round newRound = roundTurnService.prepareNewRound(latestGame.getId());
        roundTurnService.findNextPlayerStateInCharacterChoicePhase(latestGame.getId(), newRound.getKing());
        roundTurnService.createNewTurn(latestGame.getId(), 1);
        return lobbyDto;
    }

    public Game createAndAddBuildingDeck(Game game) {
        BuildingDeck buildingDeck = buildingDeckService.createBuildingDeck();
        game.setBuildingDeck(buildingDeck);
        game.setCoinsInBank(32);
        return gameService.saveGame(game);
    }
}