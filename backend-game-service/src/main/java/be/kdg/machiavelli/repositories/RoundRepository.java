package be.kdg.machiavelli.repositories;

import be.kdg.machiavelli.domain.Game;
import be.kdg.machiavelli.domain.Round;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface RoundRepository extends JpaRepository<Round, UUID> {
    List<Round> findRoundsByGame(Game game);

    Optional<Round> findTopByGameOrderByCreatedAtDesc(Game game);
}
