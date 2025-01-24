package be.kdg.machiavelli.repositories;

import be.kdg.machiavelli.domain.Lobby;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface LobbyRepository extends JpaRepository<Lobby, UUID> {

    List<Lobby> findByOpenTrue();

    List<Lobby> findLobbiesByOpen(boolean open);
}
