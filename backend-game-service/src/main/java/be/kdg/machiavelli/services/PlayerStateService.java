package be.kdg.machiavelli.services;

import be.kdg.machiavelli.domain.*;
import be.kdg.machiavelli.exception.PlayerStateException;
import be.kdg.machiavelli.exception.PlayerStateNotFoundException;
import be.kdg.machiavelli.repositories.PlayerStateRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class PlayerStateService {
    private final PlayerStateRepository playerStateRepository;
    private final PlayerService playerService;


    public PlayerStateService(PlayerStateRepository playerStateRepository, PlayerService playerService) {
        this.playerStateRepository = playerStateRepository;
        this.playerService = playerService;
    }

    public PlayerState save(PlayerState playerState) {
        return playerStateRepository.save(playerState);
    }

    @Transactional
    public PlayerState findPlayerStateByPlayerId(UUID playerId) {
        return playerStateRepository.findPlayerStateByPlayerId(playerId)
                .orElseThrow(() -> new PlayerStateException("Playerstate not found"));
    }

    @Transactional
    public void resetPlayerState(PlayerState playerState) {
        playerState.setAssassinated(false);
        playerState.setCharacters(new ArrayList<>());
        playerState.setCharactersThatHavePlayed(new ArrayList<>());
        playerStateRepository.save(playerState);
    }


    @Transactional
    public PlayerState updateIsKingPlayerState(UUID playerId) {
        List<PlayerState> allPlayerStates = playerStateRepository.findAll();
        for (PlayerState state : allPlayerStates) {
            state.setKing(false);
        }
        playerStateRepository.saveAll(allPlayerStates);

        PlayerState playerState = findPlayerStateByPlayer(playerId);
        playerState.setKing(true);
        return playerStateRepository.save(playerState);
    }

    @Transactional
    public PlayerState findPlayerStateByPlayer(UUID playerId) {
        Player player = playerService.findPlayerById(playerId);
        Optional<PlayerState> playerState = playerStateRepository.findPlayerStateByPlayer(player);
        return playerState.orElseThrow(() -> new PlayerStateNotFoundException("Playerstate not found"));
    }


    @Transactional
    public List<PlayerState> findPlayerStatesByPlayersIds(List<UUID> playerIds) {
        return playerStateRepository.findByPlayer_idIn(playerIds);
    }
}
