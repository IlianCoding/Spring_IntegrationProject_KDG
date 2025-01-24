package be.kdg.machiavelli.services;

import be.kdg.machiavelli.TestcontainersConfiguration;
import be.kdg.machiavelli.controllers.dto.ProfileDto;
import be.kdg.machiavelli.domain.Player;
import be.kdg.machiavelli.domain.PlayerState;
import be.kdg.machiavelli.domain.Profile;
import be.kdg.machiavelli.exception.ProfileNotFoundException;
import be.kdg.machiavelli.repositories.ProfileRepository;
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
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;


@Import(TestcontainersConfiguration.class)
@SpringBootTest
class ProfileServiceTest {

    @MockBean
    private ProfileRepository profileRepository;

    @MockBean
    private PlayerService playerService;

    @MockBean
    private PlayerStateService playerStateService;

    @Autowired
    private ProfileService profileService;

    private Profile profile;
    private ProfileDto profileDto;
    private UUID profileId;
    private UUID friendId;

    @BeforeEach
    void setUp() {
        profileId = UUID.randomUUID();
        friendId = UUID.randomUUID();

        profile = new Profile();
        profile.setId(profileId);
        profile.setName("Test Name");

        List<Profile> profiles = new ArrayList<>();
        profiles.add(new Profile());
        profiles.add(new Profile());
        profile.setFriends(profiles);

        profileDto = new ProfileDto(profileId, "Test Name", "null", 2, LocalDate.now(), "", null, null, null, null, null, null, "","");
    }

    @Test
    void findById_shouldReturnProfile() {
        // Arrange
        when(profileRepository.findById(profileId)).thenReturn(Optional.of(profile));

        // Act
        Profile result = profileService.findById(profileId);

        // Assert
        assertNotNull(result);
        assertEquals(profile, result);
        verify(profileRepository).findById(profileId);
    }

    @Test
    void findById_shouldThrowExceptionWhenNotFound() {
        // Arrange
        when(profileRepository.findById(profileId)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(ProfileNotFoundException.class, () -> profileService.findById(profileId));
        verify(profileRepository).findById(profileId);
    }

    @Test
    void findDtoById_shouldReturnProfileDto() {
        // Arrange
        when(profileRepository.findById(profileId)).thenReturn(Optional.of(profile));

        // Act
        ProfileDto result = profileService.findDtoById(profileId);

        // Assert
        assertNotNull(result);
        assertEquals(profile.getName(), result.name());
        verify(profileRepository).findById(profileId);
    }

    @Test
    void setAvatarUrl_shouldUpdateAvatarUrl() {
        // Arrange
        String avatarUrl = "http://example.com/avatar.png";
        when(profileRepository.findById(profileId)).thenReturn(Optional.of(profile));

        // Act
        profileService.setAvatarUrl(profileId, avatarUrl);

        // Assert
        assertEquals(avatarUrl, profile.getAvatarUrl());
        verify(profileRepository).save(profile);
    }

    @Test
    void updateProfile_shouldUpdateProfileDetails() {
        // Arrange
        when(profileRepository.findById(profileDto.id())).thenReturn(Optional.of(profile));

        // Act
        profileService.updateProfile(profileDto);

        // Assert
        assertEquals(profileDto.name(), profile.getName());
        verify(profileRepository).save(profile);
    }

    @Test
    void addFriend_shouldAddFriendToProfile() {
        // Arrange
        Profile friend = new Profile();
        friend.setId(friendId);
        when(profileRepository.findById(profileId)).thenReturn(Optional.of(profile));
        when(profileRepository.findById(friendId)).thenReturn(Optional.of(friend));

        // Act
        profileService.addFriend(profileId, friendId);

        // Assert
        assertTrue(profile.getFriends().contains(friend));
        verify(profileRepository).save(profile);
    }

    @Test
    void removeFriend_shouldRemoveFriendFromProfile() {
        // Arrange
        Profile friend = new Profile();
        friend.setId(friendId);
        profile.getFriends().add(friend);
        when(profileRepository.findById(profileId)).thenReturn(Optional.of(profile));
        when(profileRepository.findById(friendId)).thenReturn(Optional.of(friend));

        // Act
        profileService.removeFriend(profileId, friendId);

        // Assert
        assertFalse(profile.getFriends().contains(friend));
        verify(profileRepository).save(profile);
    }

    @Test
    void findPlayerStates_shouldReturnPlayerStates() {
        // Arrange
        Player player = new Player();
        player.setId(UUID.randomUUID());
        PlayerState playerState = new PlayerState();
        playerState.setId(UUID.randomUUID());

        when(profileRepository.findById(profileId)).thenReturn(Optional.of(profile));
        when(playerService.findPlayersByProfile(profile)).thenReturn(List.of(player));
        when(playerStateService.findPlayerStateByPlayerId(player.getId())).thenReturn(playerState);

        // Act
        List<PlayerState> result = profileService.findPlayerStates(profileId);

        // Assert
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(playerState, result.get(0));
        verify(profileRepository).findById(profileId);
    }
}