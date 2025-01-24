package be.kdg.machiavelli.services;

import be.kdg.machiavelli.config.properties.ConfigProperties;
import be.kdg.machiavelli.domain.*;
import be.kdg.machiavelli.controllers.dto.AchievementDto;
import be.kdg.machiavelli.controllers.mappers.AchievementMapper;
import be.kdg.machiavelli.exception.GameNotFoundException;
import be.kdg.machiavelli.exception.PlayerStateNotFoundException;
import be.kdg.machiavelli.repositories.AchievementRepository;
import be.kdg.machiavelli.repositories.GameRepository;
import jakarta.transaction.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
public class AchievementService {

    private static final Logger logger = LoggerFactory.getLogger(AchievementService.class);
    private final AchievementRepository achievementRepository;
    private final AchievementMapper achievementMapper;

    private final GameRepository gameRepository;
    private final ConfigProperties configProperties;

    public AchievementService(AchievementRepository achievementRepository, GameRepository gameRepository, ConfigProperties configProperties, AchievementMapper achievementMapper) {
        this.achievementRepository = achievementRepository;
        this.gameRepository = gameRepository;
        this.configProperties = configProperties;
        this.achievementMapper = achievementMapper;
    }

    @Transactional
    public void checkAchievementConditions(Player player) {
        List<Achievement> achievements = achievementRepository.findAll();
        List<Achievement> achievementsOfPlayer = player.getProfile().getAchievements();
        List<Achievement> achievementsNotAchievedByPlayer = achievements.stream().filter(achievement -> !achievementsOfPlayer.contains(achievement)).toList();

        for (Achievement achievement : achievementsNotAchievedByPlayer) {
            achievementSelector(achievement, player.getProfile());
        }
    }

    @Transactional
    public void achievementSelector(Achievement achievement, Profile profile) {
        List<Achievement> achievementsOfPlayer = profile.getAchievements();
        List<Game> games = gameRepository.findAll().stream()
                .filter(game -> game.getPlayerStates().stream()
                        .anyMatch(playerState -> playerState.getPlayer().getProfile().equals(profile)))
                .toList();

        Game lastGame;
        try {
            lastGame = games.stream()
                    .filter(Game::isCompleted).toList().getLast();
        } catch (NoSuchElementException e) {
            throw new GameNotFoundException(e.getMessage());
        }

        Duration duration = Duration.between(lastGame.getStartTime(), lastGame.getEndTime());
        long minutes = duration.toMinutes();

        PlayerState playerStateLastGame = lastGame.getPlayerStates().stream()
                .filter(playerState -> playerState.getPlayer().getProfile().equals(profile))
                .findFirst()
                .orElseThrow(() -> new PlayerStateNotFoundException("Player state not found"));


        switch (achievement.getName()) {
            case "Pro":
                if (games.size() >= configProperties.getAchievementPro()) {
                    achievementsOfPlayer.add(achievement);
                    profile.setAchievements(achievementsOfPlayer);
                    profile.setNumberOfLoyaltyPoints(profile.getNumberOfLoyaltyPoints() + achievement.getNumberOfLoyaltyPoints());
                }
                break;
            case "Expert":
                if (games.size() >= configProperties.getAchievementExpert()) {
                    achievementsOfPlayer.add(achievement);
                    profile.setAchievements(achievementsOfPlayer);
                    profile.setNumberOfLoyaltyPoints(profile.getNumberOfLoyaltyPoints() + achievement.getNumberOfLoyaltyPoints());
                }
                break;
            case "Speedrunner":
                if (minutes <= configProperties.getAchievementSpeedrunner()) {
                    achievementsOfPlayer.add(achievement);
                    profile.setAchievements(achievementsOfPlayer);
                    profile.setNumberOfLoyaltyPoints(profile.getNumberOfLoyaltyPoints() + achievement.getNumberOfLoyaltyPoints());
                }
                break;
            case "High roller":
                if (playerStateLastGame != null && playerStateLastGame.getScore() >= configProperties.getAchievementHighRoller()) {
                    achievementsOfPlayer.add(achievement);
                    profile.setAchievements(achievementsOfPlayer);
                    profile.setNumberOfLoyaltyPoints(profile.getNumberOfLoyaltyPoints() + achievement.getNumberOfLoyaltyPoints());
                }
                break;
            case "Addict":
                LocalDate weekAgo = LocalDateTime.now().minusDays(7).toLocalDate();
                List<Game> gamesOfWeek = games.stream()
                        .filter(game -> game.getStartTime().toLocalDate().isAfter(weekAgo.minusDays(1)))
                        .toList();

                Set<LocalDate> weekDays = Stream.iterate(weekAgo, date -> date.plusDays(1))
                        .limit(7)
                        .collect(Collectors.toSet());

                Set<LocalDate> gameDays = gamesOfWeek.stream()
                        .map(game -> game.getStartTime().toLocalDate())
                        .collect(Collectors.toSet());

                if (gameDays.containsAll(weekDays)) {
                    achievementsOfPlayer.add(achievement);
                    profile.setAchievements(achievementsOfPlayer);
                    profile.setNumberOfLoyaltyPoints(profile.getNumberOfLoyaltyPoints() + achievement.getNumberOfLoyaltyPoints());
                }
                break;
            case "Master architect":
                if (playerStateLastGame != null) {
                    if (playerStateLastGame.getBuildingsBuilt().size() == configProperties.getAchievementMasterArchitect()) {
                        achievementsOfPlayer.add(achievement);
                        profile.setAchievements(achievementsOfPlayer);
                        profile.setNumberOfLoyaltyPoints(profile.getNumberOfLoyaltyPoints() + achievement.getNumberOfLoyaltyPoints());
                    }
                }
                break;
            case "Hoarder":
                if (playerStateLastGame != null) {
                    if (playerStateLastGame.getBuildingsInHand().size() == configProperties.getAchievementHoarder()) {
                        achievementsOfPlayer.add(achievement);
                        profile.setAchievements(achievementsOfPlayer);
                        profile.setNumberOfLoyaltyPoints(profile.getNumberOfLoyaltyPoints() + achievement.getNumberOfLoyaltyPoints());
                    }
                }
                break;
            case "Beginner architect":
                List<PlayerState> playerStates = games.stream()
                        .flatMap(game -> game.getPlayerStates().stream())
                        .filter(playerState -> playerState.getPlayer().getProfile().equals(profile))
                        .toList();
                int buildingsBuilt = playerStates.stream().filter(playerState -> !playerState.getBuildingsBuilt().isEmpty()).toList().size();

                if (buildingsBuilt >= configProperties.getAchievementBeginnerArchitect()) {
                    achievementsOfPlayer.add(achievement);
                    profile.setAchievements(achievementsOfPlayer);
                    profile.setNumberOfLoyaltyPoints(profile.getNumberOfLoyaltyPoints() + achievement.getNumberOfLoyaltyPoints());
                }
                break;
        }
    }

    public List<AchievementDto> findAll() {
        logger.debug("Finding all achievements");
        return achievementRepository.findAll().stream()
                .map(achievementMapper::toDto)
                .collect(Collectors.toList());
    }
}
