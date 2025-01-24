package be.kdg.machiavelli.services;

import be.kdg.machiavelli.controllers.dto.PlayerScoreDto;
import be.kdg.machiavelli.controllers.mappers.PlayerScoreMapper;
import be.kdg.machiavelli.domain.Leaderboard;
import be.kdg.machiavelli.domain.PlayerScore;
import be.kdg.machiavelli.domain.Profile;
import be.kdg.machiavelli.repositories.LeaderboardRepository;
import be.kdg.machiavelli.repositories.PlayerScoreRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;


@Service
public class LeaderboardService {

    private Leaderboard leaderboard;
    private final PlayerScoreMapper playerScoreMapper;
    private final PlayerScoreRepository playerScoreRepository;
    private final ProfileService profileService;
    private final LeaderboardRepository leaderboardRepository;

    public LeaderboardService(PlayerScoreMapper playerScoreMapper, PlayerScoreRepository playerScoreRepository, ProfileService profileService, LeaderboardRepository leaderboardRepository) {
        this.playerScoreMapper = playerScoreMapper;
        this.playerScoreRepository = playerScoreRepository;
        this.profileService = profileService;
        this.leaderboardRepository = leaderboardRepository;
    }

    @Transactional
    public void addScore(UUID playerId, String username, UUID gameId, LocalDateTime gameDate, int score, UUID profileId) {
        PlayerScore newScore = new PlayerScore(playerId, username, gameId, gameDate, score, profileId);
        leaderboard = leaderboardRepository.findAll().stream().findFirst().orElseGet(() -> {
            leaderboardRepository.save(leaderboard);
            return leaderboard;
        });
        List<PlayerScore> leaderboardPlayerScores = leaderboard.getScores();

        int pos = Collections.binarySearch(leaderboardPlayerScores, newScore, Comparator.comparingInt(PlayerScore::getScore).reversed());

        if (pos < 0) {
            pos = -(pos + 1);
        }

        leaderboardPlayerScores.add(pos, newScore);

        newScore.setRank(pos + 1);
        for (int i = pos + 1; i < leaderboardPlayerScores.size(); i++) {
            leaderboardPlayerScores.get(i).setRank(i + 1);
        }

        if (leaderboardPlayerScores.size() > 100) {
            leaderboardPlayerScores.remove(100);
        }

        leaderboard.setScores(leaderboardPlayerScores);
        leaderboardRepository.save(leaderboard);
    }

    @Transactional
    public void checkScoreQualifies(UUID playerId, String username, UUID gameId, LocalDateTime gameDate, int score, UUID profileId) {
        leaderboard = leaderboardRepository.findAll().stream().findFirst().orElseGet(() -> {
            leaderboardRepository.save(leaderboard);
            return leaderboard;
        });
        List<PlayerScore> leaderboardPlayerScores = leaderboard.getScores();
        if (leaderboardPlayerScores.isEmpty() || leaderboardPlayerScores.getLast().getScore() < score || leaderboardPlayerScores.size() < 100) {
            addScore(playerId, username, gameId, gameDate, score, profileId);
        }
    }

    @Transactional
    public List<PlayerScoreDto> getTopPlayers() {
        leaderboard = leaderboardRepository.findAll().stream().findFirst().orElseGet(() -> {
            leaderboardRepository.save(leaderboard);
            return leaderboard;
        });
        return playerScoreMapper.toDtos(leaderboard.getScores());
    }

    @Transactional
    public List<PlayerScoreDto> getPersonalLeaderboard(UUID profileId) {
        return playerScoreMapper.toDtos(playerScoreRepository.findAllByProfileId(profileId));
    }

    @Transactional
    public List<PlayerScoreDto> getFriendsLeaderboard(UUID profileId) {
        Profile profile = profileService.findById(profileId);
        List<Profile> friends = profile.getFriends();
        List<UUID> friendIds = friends.stream().map(Profile::getId).toList();

        return playerScoreMapper.toDtos(playerScoreRepository.findByProfileIdIsIn(friendIds));
    }
}
