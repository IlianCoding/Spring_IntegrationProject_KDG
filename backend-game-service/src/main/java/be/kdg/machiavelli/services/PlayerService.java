package be.kdg.machiavelli.services;

import be.kdg.machiavelli.domain.Player;
import be.kdg.machiavelli.domain.Profile;
import be.kdg.machiavelli.repositories.PlayerRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class PlayerService {

    private final PlayerRepository playerRepository;

    public PlayerService(PlayerRepository playerRepository) {
        this.playerRepository = playerRepository;
    }

    @Transactional
    public Player findPlayerById(UUID id) {
        Optional<Player> player = playerRepository.findById(id);
        return player.orElse(null);
    }

    @Transactional
    public List<Player> findPlayersByProfile(Profile profile) {
        return playerRepository.findPlayersByProfile(profile);
    }

    @Transactional
    public List<Player> findPlayerByProfileId(UUID profileId) {
        return playerRepository.findPlayersByProfile_Id(profileId);
    }
}
