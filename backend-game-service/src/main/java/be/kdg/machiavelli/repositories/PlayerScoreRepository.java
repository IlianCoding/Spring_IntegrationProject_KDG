package be.kdg.machiavelli.repositories;

import be.kdg.machiavelli.domain.PlayerScore;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Collection;
import java.util.List;
import java.util.UUID;

public interface PlayerScoreRepository extends JpaRepository<PlayerScore, UUID> {

    List<PlayerScore> findByProfileIdIsIn(Collection<UUID> profileIds);
    List<PlayerScore> findAllByProfileId(UUID profileId);
}
