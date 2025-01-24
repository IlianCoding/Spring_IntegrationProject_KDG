package be.kdg.machiavelli.repositories;

import be.kdg.machiavelli.domain.Tournament;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface TournamentRepository extends JpaRepository<Tournament, UUID> {
}
