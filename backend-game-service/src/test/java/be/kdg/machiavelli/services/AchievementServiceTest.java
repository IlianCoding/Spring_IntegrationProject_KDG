package be.kdg.machiavelli.services;

import be.kdg.machiavelli.TestcontainersConfiguration;
import be.kdg.machiavelli.controllers.mappers.AchievementMapper;
import be.kdg.machiavelli.domain.*;
import be.kdg.machiavelli.exception.GameNotFoundException;
import be.kdg.machiavelli.repositories.AchievementRepository;
import be.kdg.machiavelli.repositories.GameRepository;
import be.kdg.machiavelli.repositories.PlayerRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@Import(TestcontainersConfiguration.class)
@SpringBootTest
class AchievementServiceTest {

    @Autowired
    private AchievementService achievementService;
    @MockBean
    private GameRepository gameRepository;
    @MockBean
    private AchievementMapper achievementMapper;

    @Test
    void achievementSelector_shouldHandleNoGames() {
        // Arrange
        Profile profile = new Profile();
        profile.setAchievements(new ArrayList<>());

        Player player = new Player();
        player.setProfile(profile);

        Achievement proAchievement = achievementMapper.toDomain(achievementService.findAll().getFirst());

        // Act
        when(gameRepository.findAll()).thenReturn(Collections.emptyList());

        // Assert
        assertThrows(GameNotFoundException.class,
                () -> achievementService.achievementSelector(proAchievement, profile));
    }
}