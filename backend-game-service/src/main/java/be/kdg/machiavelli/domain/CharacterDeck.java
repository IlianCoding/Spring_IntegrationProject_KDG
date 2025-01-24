package be.kdg.machiavelli.domain;

import jakarta.persistence.*;
import lombok.Data;

import java.util.List;
import java.util.UUID;

@Entity
@Data
public class CharacterDeck {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    @ManyToMany
    private List<GameCharacter> characters;
    public CharacterDeck() {
    }
    public  CharacterDeck(List<GameCharacter> characters) {
        this.characters= characters;
    }
}
