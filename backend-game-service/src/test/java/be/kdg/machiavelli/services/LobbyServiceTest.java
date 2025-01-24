package be.kdg.machiavelli.services;

import be.kdg.machiavelli.TestcontainersConfiguration;
import be.kdg.machiavelli.controllers.dto.LobbyDto;
import be.kdg.machiavelli.controllers.mappers.LobbyMapper;
import be.kdg.machiavelli.controllers.mappers.ProfileMapper;
import be.kdg.machiavelli.domain.Game;
import be.kdg.machiavelli.domain.Lobby;
import be.kdg.machiavelli.domain.Profile;
import be.kdg.machiavelli.exception.LobbyNotFoundException;
import be.kdg.machiavelli.exception.LobbyNotOpenException;
import be.kdg.machiavelli.repositories.GameRepository;
import be.kdg.machiavelli.repositories.LobbyRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@Import(TestcontainersConfiguration.class)
@SpringBootTest
class LobbyServiceTest {

    @MockBean
    private LobbyRepository lobbyRepository;

    @MockBean
    private GameRepository gameRepository;

    @MockBean
    private LobbyMapper lobbyMapper;

    @Autowired
    private LobbyService lobbyService;

    @MockBean
    private ProfileMapper profileMapper;


    private UUID lobbyId;
    private Lobby lobby;
    private LobbyDto lobbyDto;
    private Profile profile;
    private Game game;


    @BeforeEach
    void setUp() {
        profile = new Profile();
        profile.setId(UUID.randomUUID());
        profile.setNumberOfLoyaltyPoints(100);

        lobbyId = UUID.randomUUID();

        lobby = new Lobby();
        lobby.setId(lobbyId);
        lobby.setProfiles(new ArrayList<>());
        lobby.setOpen(true);
        lobby.setAverageLoyaltyPoints(100);

        game = new Game();
        game.setId(UUID.randomUUID());
        game.setLobby(lobby);

        lobbyDto = new LobbyDto(lobbyId, lobby.isOpen(), lobby.getNumber(), profileMapper.toDtos(lobby.getProfiles()), 20, profile.getId());
    }

    @Test
    void testRemakeLobby_Success() {
        // Arrange
        List<Profile> profiles = new ArrayList<>();
        profiles.add(new Profile());

        lobby.setProfiles(profiles);

        when(lobbyRepository.findById(lobbyId)).thenReturn(Optional.of(lobby));
        when(gameRepository.save(any(Game.class))).thenReturn(new Game());
        when(lobbyRepository.save(any(Lobby.class))).thenReturn(lobby);
        when(lobbyMapper.toDto(any(Lobby.class))).thenReturn(lobbyDto);

        // Act
        LobbyDto result = lobbyService.selectChoiceAfterGame(true, lobbyId);

        // Assert
        assertNotNull(result);
        assertEquals(lobbyDto.id(), result.id());
        verify(gameRepository).save(any(Game.class));
        verify(lobbyRepository).save(lobby);
    }

    @Test
    void testEndLobby_Success() {
        // Arrange
        when(lobbyRepository.findById(lobbyId)).thenReturn(Optional.of(lobby));
        when(lobbyRepository.save(any(Lobby.class))).thenReturn(lobby);
        when(lobbyMapper.toDto(any(Lobby.class))).thenReturn(lobbyDto);

        // Act
        LobbyDto result = lobbyService.selectChoiceAfterGame(false, lobbyId);

        // Assert
        assertNotNull(result);
        assertEquals(lobbyDto.id(), result.id());
        verify(lobbyRepository).save(lobby);
        assertEquals(0, lobby.getProfiles().size());
    }

    @Test
    void testSelectChoiceAfterGame_LobbyNotFound() {
        // Arrange
        when(lobbyRepository.findById(lobbyId)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(LobbyNotFoundException.class, () -> lobbyService.selectChoiceAfterGame(true, lobbyId));
        verify(lobbyRepository, never()).save(any(Lobby.class));
        verify(gameRepository, never()).save(any(Game.class));
    }

    @Test
    void findById_shouldReturnLobby() {
        // Arrange
        UUID lobbyId = lobby.getId();
        when(lobbyRepository.findById(lobbyId)).thenReturn(Optional.of(lobby));

        // Act
        Lobby result = lobbyService.findById(lobbyId);

        // Assert
        assertNotNull(result);
        assertEquals(lobbyId, result.getId());
        verify(lobbyRepository).findById(lobbyId);
    }

    @Test
    void findById_shouldThrowLobbyNotFoundException() {
        // Arrange
        UUID lobbyId = UUID.randomUUID();
        when(lobbyRepository.findById(lobbyId)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(LobbyNotFoundException.class, () -> lobbyService.findById(lobbyId));
    }

    @Test
    void findOldestProfile_shouldReturnOldestProfile() {
        // Arrange
        Profile oldestProfile = new Profile();
        oldestProfile.setBirthday(LocalDate.of(1980, 1, 1));

        profile.setBirthday(LocalDate.of(1990, 1, 1));
        lobby.getProfiles().addAll(List.of(profile, oldestProfile));

        when(lobbyRepository.findById(lobby.getId())).thenReturn(Optional.of(lobby));

        // Act
        Profile result = lobbyService.findOldestProfile(lobby.getId());

        // Assert
        assertNotNull(result);
        assertEquals(oldestProfile, result);
    }

    @Test
    void setTurnDuration_shouldUpdateTurnDurationForOpenLobby() {
        // Arrange
        int duration = 30;
        when(lobbyRepository.findById(lobby.getId())).thenReturn(Optional.of(lobby));
        when(gameRepository.findTopByLobbyOrderByStartTimeDesc(lobby)).thenReturn(game);

        // Act
        lobbyService.setTurnDuration(lobby.getId(), duration);

        // Assert
        assertEquals(duration, game.getTurnDuration());
        verify(gameRepository).save(game);
    }

    @Test
    void setTurnDuration_shouldThrowLobbyNotOpenException() {
        // Arrange
        lobby.setOpen(false);
        when(lobbyRepository.findById(lobby.getId())).thenReturn(Optional.of(lobby));

        // Act & Assert
        assertThrows(LobbyNotOpenException.class, () -> lobbyService.setTurnDuration(lobby.getId(), 30));
    }

}