package be.kdg.machiavelli.repositories;

import be.kdg.machiavelli.domain.Achievement;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;

public interface AchievementRepository extends JpaRepository<Achievement, UUID> {
}