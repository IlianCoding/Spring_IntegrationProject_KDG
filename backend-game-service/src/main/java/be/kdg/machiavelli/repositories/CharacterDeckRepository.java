package be.kdg.machiavelli.repositories;

import be.kdg.machiavelli.domain.CharacterDeck;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface CharacterDeckRepository extends JpaRepository<CharacterDeck, UUID> {
}
