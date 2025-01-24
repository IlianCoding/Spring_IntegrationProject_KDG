package be.kdg.machiavelli.repositories;

import be.kdg.machiavelli.domain.Round;
import be.kdg.machiavelli.domain.Turn;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface TurnRepository extends JpaRepository<Turn, UUID> {
    Optional<Turn> findByPlayerState_IdAndRound_Id(UUID playerStateId, UUID roundId);
    List<Turn> findTurnsByRound(Round round);
    Optional<Turn> findTopByRound_Game_IdAndPlayerState_Player_Profile_IdOrderByCreatedAtDesc(UUID gameId, UUID profileId);
    Optional<Turn> findTopByRound_Game_IdOrderByCreatedAtDesc(UUID gameId);

    List<Turn> findByRound(Round round);

    int countByRound(Round round);
}
