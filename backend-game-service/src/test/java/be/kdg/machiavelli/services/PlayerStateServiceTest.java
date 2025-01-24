package be.kdg.machiavelli.services;

import be.kdg.machiavelli.TestcontainersConfiguration;
import be.kdg.machiavelli.controllers.dto.PlayerStateDto;
import be.kdg.machiavelli.domain.Building;
import be.kdg.machiavelli.domain.GameCharacter;
import be.kdg.machiavelli.domain.Player;
import be.kdg.machiavelli.domain.PlayerState;
import be.kdg.machiavelli.exception.PlayerStateNotFoundException;
import be.kdg.machiavelli.repositories.PlayerStateRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;


@Import(TestcontainersConfiguration.class)
@SpringBootTest
class PlayerStateServiceTest {

    @MockBean
    private PlayerStateRepository playerStateRepository;

    @MockBean
    private PlayerService playerService;

    @MockBean
    private CharacterService characterService;


    @Autowired
    private PlayerStateService playerStateService;

    private Player player;
    private PlayerState playerState;
    private GameCharacter gameCharacter;

    @BeforeEach
    void setUp() {
        player = new Player();
        player.setId(UUID.randomUUID());
        playerState = new PlayerState();
        playerState.setPlayer(player);
        playerState.setId(UUID.randomUUID());
        playerState.setBuildingsInHand(List.of(new Building(), new Building()));
        playerState.setBuildingsBuilt(List.of(new Building(), new Building()));
        gameCharacter = new GameCharacter();
        gameCharacter.setId(UUID.randomUUID());
        List<GameCharacter> characters = new ArrayList<>();
        characters.add(gameCharacter);
        playerState.setCharacters(characters);
    }


    @Test
    void resetPlayerState_shouldResetPlayerState() {
        // Arrange
        playerState.setAssassinated(true);

        // Act
        playerStateService.resetPlayerState(playerState);

        // Assert
        assertFalse(playerState.isAssassinated());
        verify(playerStateRepository).save(playerState);
    }

    @Test
    void updateIsKingPlayerState_shouldUpdateKingStatus() {
        // Arrange
        List<PlayerState> allPlayerStates = List.of(playerState);
        when(playerStateRepository.findAll()).thenReturn(allPlayerStates);
        when(playerStateRepository.saveAll(allPlayerStates)).thenReturn(allPlayerStates);
        when(playerService.findPlayerById(player.getId())).thenReturn(player);
        when(playerStateRepository.findPlayerStateByPlayer(player)).thenReturn(Optional.of(playerState));
        when(playerStateRepository.save(playerState)).thenReturn(playerState);

        // Act
        PlayerState result = playerStateService.updateIsKingPlayerState(player.getId());

        // Assert
        assertNotNull(result);
        assertTrue(result.isKing());
        verify(playerStateRepository).save(playerState);
    }

    @Test
    void findPlayerStateByPlayer_shouldReturnPlayerState() {
        // Arrange
        when(playerService.findPlayerById(player.getId())).thenReturn(player);
        when(playerStateRepository.findPlayerStateByPlayer(player)).thenReturn(Optional.of(playerState));

        // Act
        PlayerState result = playerStateService.findPlayerStateByPlayer(player.getId());

        // Assert
        assertNotNull(result);
        assertEquals(playerState, result);
        verify(playerStateRepository).findPlayerStateByPlayer(player);
    }

    @Test
    void findPlayerStateByPlayer_shouldThrowExceptionWhenNotFound() {
        // Arrange
        when(playerService.findPlayerById(player.getId())).thenReturn(player);
        when(playerStateRepository.findPlayerStateByPlayer(player)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(PlayerStateNotFoundException.class, () -> playerStateService.findPlayerStateByPlayer(player.getId()));
        verify(playerStateRepository).findPlayerStateByPlayer(player);
    }
}