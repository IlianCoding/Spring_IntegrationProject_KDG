package be.kdg.machiavelli.services;

import be.kdg.machiavelli.TestcontainersConfiguration;
import be.kdg.machiavelli.controllers.dto.*;
import be.kdg.machiavelli.controllers.mappers.GameMapper;
import be.kdg.machiavelli.domain.*;
import be.kdg.machiavelli.exception.GameNotFoundException;
import be.kdg.machiavelli.repositories.GameRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;

import java.time.LocalDateTime;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.anyList;
import static org.mockito.Mockito.*;

@Import(TestcontainersConfiguration.class)
@SpringBootTest
class GameServiceTest {

    @MockBean
    private GameRepository gameRepository;

    @MockBean
    private PlayerStateService playerStateService;

    @MockBean
    private GameMapper gameMapper;

    @Autowired
    private GameService gameService;

    @MockBean
    private PlayerService playerService;

    private PlayerState playerState;
    private LobbyDto lobbyDto;
    private PlayerDto playerDto;
    private List<BuildingDto> buildings;
    private Game game;
    private List<PlayerState> playerStates;
    private List<CharacterDto> characters;
    private BuildingDeckDto buildingDeckDto;
    private GameCharacter kingCharacter;

    private Player player;
    private PlayerStateDto playerStateDto;
    private UUID profileId;


    @BeforeEach
    void setUp() {
        UUID playerId = UUID.randomUUID();
        profileId = UUID.randomUUID();
        player = new Player();
        player.setId(playerId);

        Lobby lobby = new Lobby();

        playerState = new PlayerState();
        playerStateDto = new PlayerStateDto(playerState.getId(), playerState.getScore(), playerState.getNumberOfCoins(), playerState.isAssassinated(), playerState.isKing(), playerState.getNumber(), playerDto, characters, characters, buildings, buildings, playerState.getNotification(), playerState.isFirstToEightBuildings(), playerState.isHasEightOrMoreBuildings());
        playerState.setId(UUID.randomUUID());

        player = new Player();
        player.setId(UUID.randomUUID());

        playerState = new PlayerState();
        playerState.setPlayer(player);

        playerStates = List.of(playerState);

        lobby = new Lobby();
        lobby.setId(UUID.randomUUID());

        game = new Game();
        game.setId(UUID.randomUUID());
        game.setPlayerStates(playerStates);
        game.setLobby(lobby);

        kingCharacter = new GameCharacter();
        kingCharacter.setName("King");
    }

    @Test
    void findGameById_shouldReturnGame() {
        // Arrange
        UUID gameId = game.getId();
        when(gameRepository.findById(gameId)).thenReturn(Optional.of(game));

        // Act
        Game result = gameService.findGameById(gameId);

        // Assert
        assertNotNull(result);
        assertEquals(gameId, result.getId());
        verify(gameRepository).findById(gameId);
    }

    @Test
    void findGameById_shouldThrowGameNotFoundException() {
        // Arrange
        UUID gameId = UUID.randomUUID();
        when(gameRepository.findById(gameId)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(GameNotFoundException.class, () -> gameService.findGameById(gameId));
    }

    @Test
    void updateNumberOfRoundsOfGame_shouldIncrementNumberOfRounds() {
        // Arrange
        UUID gameId = game.getId();
        game.setNumberOfRounds(3);
        when(gameRepository.findById(gameId)).thenReturn(Optional.of(game));

        // Act
        gameService.updateNumberOfRoundsOfGame(gameId);

        // Assert
        assertEquals(4, game.getNumberOfRounds());
        verify(gameRepository).save(game);
    }

    @Test
    void testGamesOfWeek_WithGames() {
        // Arrange
        Game recentGame = new Game();
        recentGame.setEndTime(LocalDateTime.now().minusDays(3));

        List<Game> games = List.of(recentGame);
        List<GameDto> gameDtos = List.of(new GameDto(UUID.fromString("963f3468-ddae-4dd3-a9f0-7e1814ae6097"), 5, LocalDateTime.now(), null, 20, 5, false, null, lobbyDto, List.of(playerStateDto), buildingDeckDto));

        when(playerService.findPlayerByProfileId(profileId)).thenReturn(List.of(player));
        when(playerStateService.findPlayerStatesByPlayersIds(List.of(player.getId()))).thenReturn(List.of(playerState));
        when(gameRepository.findGamesByPlayerStatesContains(playerState)).thenReturn(games);
        when(gameMapper.toDtos(anyList())).thenReturn(gameDtos);

        // Act
        List<GameDto> result = gameService.gamesOfWeek(profileId);

        // Assert
        assertEquals(1, result.size());
        assertEquals(result.getFirst().id(), UUID.fromString("963f3468-ddae-4dd3-a9f0-7e1814ae6097"));
        verify(playerStateService).findPlayerStatesByPlayersIds(List.of(player.getId()));
        verify(gameRepository).findDistinctByPlayerStatesIn(List.of(playerState));
    }

    @Test
    void testGamesOfWeek_NoGamesInLastWeek() {
        // Arrange
        Game oldGame = new Game();
        oldGame.setEndTime(LocalDateTime.now().minusDays(10));

        List<Game> games = List.of(oldGame);

        when(playerService.findPlayerByProfileId(profileId)).thenReturn(List.of(player));
        when(playerStateService.findPlayerStatesByPlayersIds(List.of(player.getId()))).thenReturn(List.of(playerState));
        when(gameRepository.findGamesByPlayerStatesContains(playerState)).thenReturn(games);
        when(gameMapper.toDtos(anyList())).thenReturn(new ArrayList<>());

        // Act
        List<GameDto> result = gameService.gamesOfWeek(profileId);

        // Assert
        assertEquals(0, result.size());
        verify(playerStateService).findPlayerStatesByPlayersIds(List.of(player.getId()));
        verify(gameRepository).findDistinctByPlayerStatesIn(List.of(playerState));
    }

    @Test
    void testGamesOfWeek_PlayerNotFound() {
        // Arrange
        when(playerService.findPlayerByProfileId(profileId)).thenReturn(List.of(player));
        when(playerStateService.findPlayerStatesByPlayersIds(List.of(player.getId()))).thenThrow(new IllegalArgumentException("Player not found"));

        // Act & Assert
        try {
            gameService.gamesOfWeek(profileId);
        } catch (IllegalArgumentException e) {
            assertEquals("Player not found", e.getMessage());
        }

        verify(playerStateService).findPlayerStatesByPlayersIds(List.of(player.getId()));
    }

    @Test
    void testGetOngoingGames_Success() {
        UUID profileId = UUID.randomUUID();
        UUID playerId = UUID.randomUUID();

        Player player = new Player();
        player.setId(playerId);
        List<Player> players = List.of(player);

        PlayerState playerState = new PlayerState();
        List<PlayerState> playerStates = List.of(playerState);

        Game ongoingGame = new Game();
        ongoingGame.setCompleted(false);
        ongoingGame.setId(UUID.fromString("d5790ad6-9335-4603-bff2-a925e6a1de80"));
        List<Game> games = List.of(ongoingGame);

        GameDto gameDto = new GameDto(UUID.fromString("d5790ad6-9335-4603-bff2-a925e6a1de80"), 5, LocalDateTime.now(), null, 20, 5, false, null, lobbyDto, List.of(playerStateDto), buildingDeckDto);

        List<GameDto> gameDtos = List.of(gameDto);

        when(playerService.findPlayerByProfileId(profileId)).thenReturn(players);
        when(playerStateService.findPlayerStatesByPlayersIds(List.of(playerId))).thenReturn(playerStates);
        when(gameRepository.findDistinctByPlayerStatesIn(playerStates)).thenReturn(games);
        when(gameMapper.toDtos(games)).thenReturn(gameDtos);

        List<Game> result = gameService.getOngoingGames(profileId);

        assertEquals(1, result.size());
        assertEquals(gameDtos.getFirst().id(), result.getFirst().getId());
        verify(playerService).findPlayerByProfileId(profileId);
        verify(playerStateService).findPlayerStatesByPlayersIds(List.of(playerId));
        verify(gameRepository).findDistinctByPlayerStatesIn(playerStates);
    }

    @Test
    void testGetOngoingGames_NoOngoingGames() {
        UUID profileId = UUID.randomUUID();
        UUID playerId = UUID.randomUUID();

        Player player = new Player();
        player.setId(playerId);
        List<Player> players = List.of(player);

        PlayerState playerState = new PlayerState();
        List<PlayerState> playerStates = List.of(playerState);

        when(playerService.findPlayerByProfileId(profileId)).thenReturn(players);
        when(playerStateService.findPlayerStatesByPlayersIds(List.of(playerId))).thenReturn(playerStates);
        when(gameRepository.findDistinctByPlayerStatesIn(playerStates)).thenReturn(Collections.emptyList());

        List<Game> result = gameService.getOngoingGames(profileId);

        assertTrue(result.isEmpty());
        verify(playerService).findPlayerByProfileId(profileId);
        verify(playerStateService).findPlayerStatesByPlayersIds(List.of(playerId));
        verify(gameRepository).findDistinctByPlayerStatesIn(playerStates);
    }
}