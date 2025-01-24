package be.kdg.machiavelli.services;

import be.kdg.machiavelli.TestcontainersConfiguration;
import be.kdg.machiavelli.controllers.dto.LobbyDto;
import be.kdg.machiavelli.controllers.mappers.LobbyMapper;
import be.kdg.machiavelli.domain.BuildingDeck;
import be.kdg.machiavelli.domain.Game;
import be.kdg.machiavelli.domain.Lobby;
import org.junit.jupiter.api.BeforeEach;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.junit.jupiter.api.Test;

import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@Import(TestcontainersConfiguration.class)
@SpringBootTest
class LobbySetupServiceTest {

    @MockBean
    private LobbyService lobbyService;

    @MockBean
    private GameService gameService;

    @MockBean
    private RoundService roundService;

    @MockBean
    private BuildingDeckService buildingDeckService;

    @Autowired
    private LobbySetupService lobbySetupService;


    private LobbyDto lobbyDto;
    private Lobby lobby;
    private Game game;
    private BuildingDeck buildingDeck;
    @Autowired
    private LobbyMapper lobbyMapper;

    @BeforeEach
    void setUp() {
        game = new Game();
        game.setId(UUID.randomUUID());

        Lobby lobby = new Lobby();
        lobby.setId(UUID.randomUUID());

        lobbyDto = lobbyMapper.toDto(lobby);
    }

    @Test
    void createAndAddBuildingDeck_shouldAddDeckAndSaveGame() {
        // Arrange
        when(buildingDeckService.createBuildingDeck()).thenReturn(buildingDeck);
        when(gameService.saveGame(any(Game.class))).thenReturn(game);

        // Act
        Game result = lobbySetupService.createAndAddBuildingDeck(game);

        // Assert
        assertNotNull(result);
        assertEquals(game, result);

        verify(buildingDeckService).createBuildingDeck();
        verify(gameService).saveGame(game);
        assertEquals(buildingDeck, game.getBuildingDeck());
        assertEquals(32, game.getCoinsInBank());
    }

}