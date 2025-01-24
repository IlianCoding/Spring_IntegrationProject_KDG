package be.kdg.machiavelli.repositories;

import be.kdg.machiavelli.domain.Player;
import be.kdg.machiavelli.domain.Profile;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface PlayerRepository extends JpaRepository<Player, UUID> {
    List<Player> findPlayersByProfile(Profile profile);

    List<Player> findPlayersByProfile_Id(UUID profileId);
}
