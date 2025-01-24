package be.kdg.machiavelli.controllers;

import be.kdg.machiavelli.controllers.dto.GameDto;
import be.kdg.machiavelli.controllers.dto.OngoingGamesDto;
import be.kdg.machiavelli.domain.Lobby;
import be.kdg.machiavelli.services.GameService;
import org.springframework.security.access.prepost.PreAuthorize;
import be.kdg.machiavelli.services.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/game")
public class GameController {
    private final GameService gameService;
    private final LobbyService lobbyService;
    private static final Logger logger = LoggerFactory.getLogger(GameController.class);
    private final ProfileService profileService;
    private final OngoingGameService ongoingGameService;

    public GameController(GameService gameService, LobbyService lobbyService, ProfileService profileService, OngoingGameService ongoingGameService) {
        this.gameService = gameService;
        this.lobbyService = lobbyService;
        this.profileService = profileService;
        this.ongoingGameService = ongoingGameService;
    }

    @GetMapping("/{gameId}")
    @PreAuthorize("hasAuthority('player')")
    public GameDto getGame(@PathVariable UUID gameId) {
        return gameService.findByIdDto(gameId);
    }

    @GetMapping("/{profileId}/ongoing-games")
    @PreAuthorize("hasAuthority('player')")
    public List<OngoingGamesDto> getOngoingGames(@PathVariable UUID profileId) {
        logger.debug("Getting ongoing games with profile id: {}", profileId);
        return ongoingGameService.getOngoingGamesWithCurrentPlayerGames(gameService.getOngoingGames(profileId));
    }

    @GetMapping("/{lobbyId}/latest-game")
    @PreAuthorize("hasAuthority('player')")
    public GameDto getLatestGameOfLobby(@PathVariable UUID lobbyId){
        Lobby lobby = lobbyService.findById(lobbyId);
        return gameService.findLatestGameOfLobby(lobby);
    }
    /*@PutMapping("/{gameId}/{profileId}")
    @PreAuthorize("hasAuthority('player')")
    public ResponseEntity<GameDto> quitGame(@PathVariable String gameId, @PathVariable String profileId){

    }*/


    @GetMapping("/{profileId}/get-games-of-week")
    @PreAuthorize("hasAuthority('player')")
    public List<GameDto> getGamesOfWeek(@PathVariable UUID profileId) {
        logger.debug("Getting games of week with profile id: {}", profileId);
        return gameService.gamesOfWeek(profileId);
    }
}
