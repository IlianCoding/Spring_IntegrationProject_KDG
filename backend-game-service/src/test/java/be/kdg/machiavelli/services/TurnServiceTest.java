package be.kdg.machiavelli.services;

import be.kdg.machiavelli.TestcontainersConfiguration;
import be.kdg.machiavelli.controllers.dto.BuildingDto;
import be.kdg.machiavelli.controllers.dto.TurnDto;
import be.kdg.machiavelli.domain.*;
import be.kdg.machiavelli.domain.enums.TurnFase;
import be.kdg.machiavelli.exception.NotEnoughResourcesException;
import be.kdg.machiavelli.repositories.TurnRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;

import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@Import(TestcontainersConfiguration.class)
@SpringBootTest
class TurnServiceTest {

    @Autowired
    private TurnService turnService;

    @MockBean
    private TurnRepository turnRepository;

    @MockBean
    private BuildingDeckService buildingDeckService;

    private UUID turnId;
    private Turn turn;
    private Round round;
    private Game game;
    private PlayerState playerState;
    private BuildingDeck buildingDeck;

    @BeforeEach
    void setUp() {
        turnId = UUID.randomUUID();

        Round round = new Round();
        round.setGame(game);
        game = new Game();
        game.setCoinsInBank(100);
        buildingDeck = new BuildingDeck();
        buildingDeck.setId(UUID.randomUUID());
        buildingDeck.setBuildings(new ArrayList<>());

        round = new Round();
        round.setGame(game);

        playerState = new PlayerState();
        playerState.setNumberOfCoins(10);
        playerState.setBuildingsInHand(new ArrayList<>());
        playerState.setBuildingsBuilt(new ArrayList<>());
        Player player = new Player();
        player.setId(UUID.randomUUID());
        player.setProfile(new Profile());
        playerState.setPlayer(player);
        GameCharacter gameCharacter = new GameCharacter();
        playerState.setCharacters(List.of(gameCharacter));

        turn = new Turn();
        turn.setId(turnId);
        turn.setRound(round);
        turn.setPlayerState(playerState);
        turn.setCompletedFases(new HashSet<>());

        game.setPlayerStates(List.of(playerState));
    }

    @Test
    void takeCoins_shouldThrowExceptionWhenInsufficientCoinsInBank() {
        // Arrange
        int coinsToTake = 150; // More than available in the bank
        when(turnRepository.findById(turnId)).thenReturn(Optional.of(turn));

        // Act & Assert
        assertThrows(NotEnoughResourcesException.class, () -> turnService.takeCoins(turnId, coinsToTake, false));
    }

    @Test
    void buildBuilding_shouldThrowExceptionWhenNotEnoughCoins() {
        // Arrange
        UUID buildingId = UUID.randomUUID();
        Building building = new Building();
        building.setId(buildingId);
        building.setCost(15); // More than the player has

        playerState.getBuildingsInHand().add(building);

        when(turnRepository.findById(turnId)).thenReturn(Optional.of(turn));

        // Act & Assert
        assertThrows(NotEnoughResourcesException.class, () -> turnService.buildBuilding(turnId, buildingId));
    }
}