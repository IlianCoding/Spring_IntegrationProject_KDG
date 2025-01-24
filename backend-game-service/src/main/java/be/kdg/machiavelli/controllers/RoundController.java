package be.kdg.machiavelli.controllers;

import be.kdg.machiavelli.controllers.dto.CharacterDeckDto;
import be.kdg.machiavelli.controllers.dto.PlayerStateDto;
import be.kdg.machiavelli.controllers.dto.RoundDto;
import be.kdg.machiavelli.domain.Round;
import be.kdg.machiavelli.services.RoundService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
@RestController
@RequestMapping("/api/rounds")
public class RoundController {

    private final RoundService roundService;
    private static final Logger logger = LoggerFactory.getLogger(RoundController.class);

    public RoundController(RoundService roundService) {
        this.roundService = roundService;

    }

    @GetMapping("/{roundId}")
    @PreAuthorize("hasAuthority('player')")
    public RoundDto getRound(@PathVariable UUID roundId) {
        return roundService.findRound(roundId);
    }

    @GetMapping("/last/{gameId}")
    @PreAuthorize("hasAuthority('player')")
    public RoundDto findLastRound(@PathVariable UUID gameId) {
        Round lastRound = roundService.findLastRound(gameId);
        return lastRound != null ? roundService.findRound(lastRound.getId()) : null;
    }

    @PutMapping("/{playerId}/{characterId}/{roundId}")
    @PreAuthorize("hasAuthority('player')")
    public ResponseEntity<PlayerStateDto> updatePlayerStateCharacter(@PathVariable UUID playerId, @PathVariable UUID characterId, @PathVariable UUID roundId) {
        PlayerStateDto playerState = roundService.updatePlayerStateCharacter(playerId, characterId, roundId);
        if (playerState == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(playerState);
    }

    @GetMapping("/{roundId}/characterdeck")
    @PreAuthorize("hasAuthority('player')")
    public ResponseEntity<CharacterDeckDto> findCharacterDeckOfRound(@PathVariable UUID roundId){
        CharacterDeckDto characterDeck = roundService.findCharacterdeckOfRound(roundId);
        if (characterDeck == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(characterDeck);
    }
}
