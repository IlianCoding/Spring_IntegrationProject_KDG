package be.kdg.machiavelli.services;

import be.kdg.machiavelli.domain.Lobby;
import be.kdg.machiavelli.domain.Tournament;
import be.kdg.machiavelli.exception.TournamentException;
import be.kdg.machiavelli.exception.TournamentNotFoundException;
import be.kdg.machiavelli.repositories.TournamentRepository;
import jakarta.transaction.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;


@Service
public class TournamentService {
    private static final Logger logger = LoggerFactory.getLogger(TournamentService.class);
    private final TournamentRepository tournamentRepository;
    private final LobbyService lobbyService;

    public TournamentService(TournamentRepository tournamentRepository, LobbyService lobbyService) {
        this.tournamentRepository = tournamentRepository;
        this.lobbyService = lobbyService;
    }

    @Transactional
    public List<Tournament> findAllTournaments() {
        List<Tournament> tournaments = tournamentRepository.findAll();
        if (tournaments.isEmpty()) throw new TournamentNotFoundException("No Tournaments found");
        logger.info("Found tournaments: {}", tournaments);
        return tournaments;
    }

    @Transactional
    public Tournament createTournament(Tournament tournament) {
        if (tournament == null) throw new TournamentNotFoundException("No Tournament found");
        Tournament newTournament = new Tournament(tournament.getName(), tournament.isOpen(), tournament.getSettings());
        return tournamentRepository.save(newTournament);
    }

    @Transactional
    public boolean joinTournament(UUID tournamentId, UUID profileId) {
        Tournament tournament = tournamentRepository.findById(tournamentId).orElseThrow(() -> new TournamentNotFoundException("Tournament not found"));

        if (!tournament.isOpen()) {
            throw new TournamentException("Tournament is not open");
        }

        if (!(tournament.getLobbies().stream()
                .mapToInt(lobby -> lobby.getProfiles().size())
                .sum() < tournament.getSettings().getMaxNumberOfPlayers())) {
            throw new TournamentException("Tournament is too full");
        }

        for (Lobby lobby : tournament.getLobbies()) {
            if (!lobby.isOpen()) throw new TournamentException("Lobby is not open");
            if (lobby.getProfiles().size() < tournament.getSettings().getPlayersPerLobby()) {
                lobbyService.addPlayer(lobby.getId(), profileId);
                tournamentRepository.save(tournament);
                return true;
            }
        }
        return false;
    }
}
