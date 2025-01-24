package be.kdg.machiavelli.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.UUID;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class PlayerState {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    private int score;
    private int numberOfCoins;
    private boolean assassinated;
    private boolean isKing;
    private int number;
    @OneToOne(fetch = FetchType.LAZY)
    private Player player;
    @ManyToMany
    private List<GameCharacter> characters;
    @ManyToMany
    private List<GameCharacter> charactersThatHavePlayed;
    @ManyToMany
    private List<Building> buildingsBuilt;
    @ManyToMany
    private List<Building> buildingsInHand;
    String notification;
    private boolean firstToEightBuildings;
    private boolean hasEightOrMoreBuildings;

    public PlayerState(UUID id, int score, int numberOfCoins, boolean assassinated, boolean isKing, int number, Player player, List<GameCharacter> characters, List<Building> buildingsBuilt, List<Building> buildingsInHand, String notification, List<GameCharacter> charactersThatHavePlayed) {
        this.id = id;
        this.score = score;
        this.numberOfCoins = numberOfCoins;
        this.assassinated = assassinated;
        this.isKing = isKing;
        this.number = number;
        this.player = player;
        this.characters = characters;
        this.buildingsBuilt = buildingsBuilt;
        this.buildingsInHand = buildingsInHand;
        this.notification = notification;
        this.charactersThatHavePlayed = charactersThatHavePlayed;
    }
}
