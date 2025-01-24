package be.kdg.machiavelli.controllers;

import be.kdg.machiavelli.controllers.dto.TournamentDto;
import be.kdg.machiavelli.controllers.mappers.TournamentMapper;
import be.kdg.machiavelli.exception.TournamentException;
import be.kdg.machiavelli.exception.TournamentNotFoundException;
import be.kdg.machiavelli.services.TournamentService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/tournaments")
public class TournamentController {
    private final TournamentService tournamentService;
    private final TournamentMapper tournamentMapper;
    private final Logger logger = LoggerFactory.getLogger(TournamentController.class);

    public TournamentController(TournamentService tournamentService, TournamentMapper tournamentMapper) {
        this.tournamentService = tournamentService;
        this.tournamentMapper = tournamentMapper;
    }

    @GetMapping("/overview")
    @PreAuthorize("hasAuthority('player')")

    public List<TournamentDto> getAllTournaments() {
        return tournamentService.findAllTournaments().stream().map(tournamentMapper::toDto).collect(Collectors.toList());
    }

    @PostMapping("/create")
    @PreAuthorize("hasAuthority('player')")

    public ResponseEntity<TournamentDto> createTournament(@RequestBody TournamentDto tournamentDto) {
        try {
            tournamentService.createTournament(tournamentMapper.toDomain(tournamentDto));
            return ResponseEntity.ok().build();
        } catch (TournamentNotFoundException e) {
            logger.error("The tournament could not be created", e);
            return ResponseEntity.badRequest().body(null);
        }
    }

    //todo profileid is de ingelogde user
    @PostMapping("/join/{tournamentId}/{profileId}")
    @PreAuthorize("hasAuthority('player')")

    public ResponseEntity<Void> joinTournament(@PathVariable UUID tournamentId, @PathVariable UUID profileId) {
        try {
            boolean isJoined = tournamentService.joinTournament(tournamentId, profileId);
            if (!isJoined) return ResponseEntity.badRequest().build();
            return ResponseEntity.ok().build();
        } catch (TournamentNotFoundException e) {
            logger.error("The tournament could not be found", e);
            return ResponseEntity.badRequest().body(null);
        } catch (TournamentException e) {
            logger.error("The tournament could not be joined", e);
            return ResponseEntity.badRequest().body(null);
        }
    }
}
