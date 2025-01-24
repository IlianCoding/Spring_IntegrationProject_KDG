package be.kdg.machiavelli.repositories;

import be.kdg.machiavelli.domain.Gimmick;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;

public interface GimmickRepository extends JpaRepository<Gimmick, UUID> {
}
