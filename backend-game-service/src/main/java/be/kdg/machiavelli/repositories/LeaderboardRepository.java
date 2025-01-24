package be.kdg.machiavelli.repositories;

import be.kdg.machiavelli.domain.Leaderboard;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface LeaderboardRepository extends JpaRepository<Leaderboard, UUID> {
}
