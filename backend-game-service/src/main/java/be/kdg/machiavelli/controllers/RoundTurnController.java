package be.kdg.machiavelli.controllers;

import be.kdg.machiavelli.services.RoundTurnService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/roundTurns")
public class RoundTurnController {

    private static final Logger logger = LoggerFactory.getLogger(RoundTurnController.class);
    private final RoundTurnService roundTurnService;


    public RoundTurnController(RoundTurnService roundTurnService) {
        this.roundTurnService = roundTurnService;
    }

    @PostMapping("/{turnId}/end-turn")
    @PreAuthorize("hasAuthority('player')")
    public ResponseEntity<Void> endTurn(@PathVariable UUID turnId) {
        roundTurnService.endTurn(turnId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{roundId}/turncount")
    @PreAuthorize("hasAuthority('player')")
    public int getCountOfAllTurnsFromRound(@PathVariable UUID roundId) {
        return roundTurnService.getCountOfAllTurnsFromRound(roundId);
    }
}
