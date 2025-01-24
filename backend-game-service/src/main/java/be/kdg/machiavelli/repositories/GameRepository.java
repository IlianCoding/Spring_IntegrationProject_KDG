package be.kdg.machiavelli.repositories;

import be.kdg.machiavelli.domain.Game;
import be.kdg.machiavelli.domain.Lobby;
import be.kdg.machiavelli.domain.PlayerState;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface GameRepository extends JpaRepository<Game, UUID> {

    List<Game> findByLobby_Id(UUID lobbyId);

    List<Game> findGamesByPlayerStatesContains(PlayerState playerState);

    Game findTopByLobbyOrderByStartTimeDesc(Lobby lobby);

    @EntityGraph(attributePaths = {"lobby"})
    List<Game> findDistinctByPlayerStatesIn(List<PlayerState> playerStates);
}
