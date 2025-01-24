package be.kdg.machiavelli.repositories;

import be.kdg.machiavelli.domain.Player;
import be.kdg.machiavelli.domain.PlayerState;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface PlayerStateRepository extends JpaRepository<PlayerState, UUID> {
    Optional<PlayerState> findPlayerStateByPlayerId(UUID playerId);

    Optional<PlayerState> findPlayerStateByPlayer(Player player);

    List<PlayerState> findByPlayer_idIn(List<UUID> playerIds);
}
