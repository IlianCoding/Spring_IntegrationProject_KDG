package be.kdg.machiavelli.controllers;

import be.kdg.machiavelli.controllers.dto.PlayerScoreDto;
import be.kdg.machiavelli.services.LeaderboardService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.UUID;


@RestController
@RequestMapping("/api/leaderboards")
public class LeaderboardController {

    private final LeaderboardService leaderboardService;

    public LeaderboardController(LeaderboardService leaderboardService) {
        this.leaderboardService = leaderboardService;
    }

    @GetMapping("/top")
    public ResponseEntity<List<PlayerScoreDto>> getTopPlayers() {
        List<PlayerScoreDto> topPlayers = leaderboardService.getTopPlayers();
        return ResponseEntity.ok(topPlayers);
    }


    @GetMapping("/{profileId}")
    @PreAuthorize("hasAuthority('player')")
    public ResponseEntity<List<PlayerScoreDto>> getPersonalScores(@PathVariable UUID profileId) {
        List<PlayerScoreDto> personalScores = leaderboardService.getPersonalLeaderboard(profileId);
        return ResponseEntity.ok(personalScores);
    }


    @GetMapping("/{profileId}/friends")
    @PreAuthorize("hasAuthority('player')")
    public ResponseEntity<List<PlayerScoreDto>> getPersonalFriends(@PathVariable UUID profileId) {
        List<PlayerScoreDto> personalFriends = leaderboardService.getFriendsLeaderboard(profileId);
        return ResponseEntity.ok(personalFriends);
    }
}
