package be.kdg.machiavelli.repositories;

import be.kdg.machiavelli.domain.GameCharacter;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface CharacterRepository extends JpaRepository<GameCharacter, UUID>{}