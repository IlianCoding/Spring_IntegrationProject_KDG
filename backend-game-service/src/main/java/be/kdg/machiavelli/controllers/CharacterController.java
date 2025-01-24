package be.kdg.machiavelli.controllers;

import be.kdg.machiavelli.controllers.dto.PlayerStateDto;
import be.kdg.machiavelli.controllers.dto.ActionDto;
import be.kdg.machiavelli.services.CharacterActionService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.UUID;

@RestController
@RequestMapping("/api/character")

public class CharacterController {

    private final CharacterActionService actionService;

    public CharacterController(CharacterActionService actionService) {
        this.actionService = actionService;
    }

    @PostMapping("/get-action")
    @PreAuthorize("hasAuthority('player')")
    public ResponseEntity<PlayerStateDto> executeCharacterAction(@RequestBody ActionDto actionDto) {
        return ResponseEntity.ok().body(actionService.actionSelector(actionDto));
    }

    @GetMapping("/can-perform-mercenary-action/{executivePlayerId}/{targetBuildingId}")
    public boolean canPerformMercenaryAction(@PathVariable UUID executivePlayerId, @PathVariable UUID targetBuildingId) {
        return actionService.canPerformMercenaryAction(executivePlayerId, targetBuildingId);
    }
}
