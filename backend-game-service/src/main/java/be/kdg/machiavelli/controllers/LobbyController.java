package be.kdg.machiavelli.controllers;

import be.kdg.machiavelli.controllers.dto.GameDto;
import be.kdg.machiavelli.controllers.dto.LobbyDto;
import be.kdg.machiavelli.services.LobbyService;
import org.springframework.security.access.prepost.PreAuthorize;
import be.kdg.machiavelli.services.LobbySetupService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/lobbies")
public class LobbyController {

    private final LobbyService lobbyService;
    private final LobbySetupService lobbySetupService;

    public LobbyController(LobbyService lobbyService, LobbySetupService lobbySetupService) {
        this.lobbyService = lobbyService;
        this.lobbySetupService = lobbySetupService;
    }

    @GetMapping("/{lobbyId}")
    @PreAuthorize("hasAuthority('player')")
    public LobbyDto getLobby(@PathVariable UUID lobbyId) {
        return lobbyService.findDtoById(lobbyId);
    }

    @GetMapping("/{lobbyId}/games")
    @PreAuthorize("hasAuthority('player')")
    public List<GameDto> getLobbyGames(@PathVariable UUID lobbyId) {
        return lobbyService.findGamesByLobbyId(lobbyId);
    }

    @PostMapping("/create")
    @PreAuthorize("hasAuthority('player')")
    public LobbyDto createLobby(@RequestBody UUID profileId) {
        return lobbyService.create(profileId);
    }

    @PutMapping("/{lobbyId}/{profileId}")
    @PreAuthorize("hasAuthority('player')")
    public LobbyDto addPlayer(@PathVariable UUID lobbyId, @PathVariable UUID profileId) {
        return lobbyService.addPlayer(lobbyId, profileId);
    }

    @PostMapping("/{lobbyId}/start")
    @PreAuthorize("hasAuthority('player')")
    public LobbyDto startGame(@PathVariable UUID lobbyId) {
        return lobbySetupService.startGame(lobbyId);
    }

    @PutMapping("/join-automatically/{profileId}")
    @PreAuthorize("hasAuthority('player')")
    public LobbyDto joinLobbyAutomatically(@PathVariable UUID profileId) {
        return lobbyService.joinLobbyAutomatically(profileId);
    }

    @PutMapping("/{lobbyId}/set-duration")
    public void setTurnDuration(@PathVariable UUID lobbyId, @RequestBody int duration) {
        lobbyService.setTurnDuration(lobbyId, duration);
    }

    @GetMapping("/open")
    public List<LobbyDto> findAllOpenLobbies() {
        return lobbyService.findAllOpenLobbies();
    }

    @GetMapping("/all")
    public List<LobbyDto> findAll() {
        return lobbyService.findAllLobbies();
    }

    @GetMapping("/{lobbyId}/ended-game-choice")
    public LobbyDto makeChoiceAfterGame(@PathVariable UUID lobbyId, @RequestParam Boolean gameChoice) {
        return lobbyService.selectChoiceAfterGame(gameChoice, lobbyId);
    }
}
