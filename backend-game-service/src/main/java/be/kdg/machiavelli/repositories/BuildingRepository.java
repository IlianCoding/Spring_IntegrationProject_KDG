package be.kdg.machiavelli.repositories;

import be.kdg.machiavelli.domain.Building;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface BuildingRepository extends JpaRepository<Building, UUID> {

}
