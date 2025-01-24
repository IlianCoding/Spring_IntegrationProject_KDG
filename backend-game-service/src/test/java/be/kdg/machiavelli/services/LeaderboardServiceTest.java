package be.kdg.machiavelli.services;

import be.kdg.machiavelli.TestcontainersConfiguration;
import be.kdg.machiavelli.controllers.dto.PlayerScoreDto;
import be.kdg.machiavelli.domain.Leaderboard;
import be.kdg.machiavelli.repositories.LeaderboardRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;


@Import(TestcontainersConfiguration.class)
@SpringBootTest
class LeaderboardServiceTest {


    @Autowired
    private LeaderboardService leaderboardService;

    @MockBean
    private LeaderboardRepository leaderboardRepository;

    @BeforeEach
    void setUp() {
        Leaderboard leaderboard = Leaderboard.getInstance();
        leaderboard.setScores(new ArrayList<>());

        Mockito.when(leaderboardRepository.findAll()).thenReturn(List.of(leaderboard));
        Mockito.when(leaderboardRepository.save(any(Leaderboard.class))).thenReturn(leaderboard);
    }

    @Test
    void testAddScore_NewPlayer_ShouldBeAdded() {
        // Arrange
        UUID playerId = UUID.randomUUID();
        leaderboardService.addScore(playerId, "Player1", UUID.fromString("d16a4438-949a-4d13-ad48-5f72dd19223b"), LocalDateTime.now(), 500, UUID.fromString("48cac9c0-092a-440b-a686-a02f9bd925a5"));

        // Act
        List<PlayerScoreDto> topPlayers = leaderboardService.getTopPlayers();

        // Assert
        assertEquals(1, topPlayers.size());
        assertEquals("Player1", topPlayers.getFirst().userName());
        assertEquals(500, topPlayers.getFirst().score());
    }

    @Test
    void testAddScore_MultiplePlayers_ShouldMaintainSortedOrder() {
        leaderboardService.addScore(UUID.randomUUID(), "Player1", UUID.fromString("d16a4438-949a-4d13-ad48-5f72dd19223b"), LocalDateTime.now(), 300, UUID.fromString("48cac9c0-092a-440b-a686-a02f9bd925a5"));
        leaderboardService.addScore(UUID.randomUUID(), "Player2", UUID.fromString("d16a4438-949a-4d13-ad48-5f72dd19223b"), LocalDateTime.now(), 500, UUID.fromString("48cac9c0-092a-440b-a686-a02f9bd925a5"));
        leaderboardService.addScore(UUID.randomUUID(), "Player3", UUID.fromString("d16a4438-949a-4d13-ad48-5f72dd19223b"), LocalDateTime.now(), 400, UUID.fromString("48cac9c0-092a-440b-a686-a02f9bd925a5"));

        List<PlayerScoreDto> topPlayers = leaderboardService.getTopPlayers();

        assertEquals(3, topPlayers.size());
        assertEquals("Player2", topPlayers.get(0).userName());
        assertEquals(500, topPlayers.get(0).score());
        assertEquals("Player3", topPlayers.get(1).userName());
        assertEquals(400, topPlayers.get(1).score());
        assertEquals("Player1", topPlayers.get(2).userName());
        assertEquals(300, topPlayers.get(2).score());
    }

    @Test
    void testAddScore_ShouldRemoveLowestScoreWhenListExceeds100() {
        for (int i = 0; i < 101; i++) {
            leaderboardService.addScore(UUID.randomUUID(), "Player" + i, UUID.fromString("d16a4438-949a-4d13-ad48-5f72dd19223b"), LocalDateTime.now(), i, UUID.fromString("48cac9c0-092a-440b-a686-a02f9bd925a5"));
        }

        List<PlayerScoreDto> topPlayers = leaderboardService.getTopPlayers();
        assertEquals(100, topPlayers.size());
        assertEquals(100, topPlayers.getFirst().score());
        assertEquals(1, topPlayers.get(99).score());
    }

    @Test
    void testCheckScore_ShouldAddIfHigherThanLastScore() {
        for (int i = 0; i < 100; i++) {
            leaderboardService.addScore(UUID.randomUUID(), "Player" + i, UUID.fromString("d16a4438-949a-4d13-ad48-5f72dd19223b"), LocalDateTime.now(), i, UUID.fromString("48cac9c0-092a-440b-a686-a02f9bd925a5"));
        }

        leaderboardService.checkScoreQualifies(UUID.randomUUID(), "NewPlayer", UUID.fromString("d16a4438-949a-4d13-ad48-5f72dd19223b"), LocalDateTime.now(), 1000, UUID.fromString("48cac9c0-092a-440b-a686-a02f9bd925a5"));

        List<PlayerScoreDto> topPlayers = leaderboardService.getTopPlayers();
        assertEquals(100, topPlayers.size());
        assertEquals("NewPlayer", topPlayers.getFirst().userName());
    }
}