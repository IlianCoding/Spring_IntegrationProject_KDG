package be.kdg.machiavelli.repositories;

import be.kdg.machiavelli.domain.BuildingDeck;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface BuildingDeckRepository extends JpaRepository<BuildingDeck, UUID> {
}
