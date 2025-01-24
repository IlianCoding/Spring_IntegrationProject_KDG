package be.kdg.machiavelli.domain;

import jakarta.persistence.*;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Data
public class Leaderboard {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<PlayerScore> scores = new ArrayList<>();

    private static Leaderboard instance;

    public Leaderboard() {
        if (instance != null) {
            return;
        }
        instance = this;
    }

    public static Leaderboard getInstance() {
        if (instance == null) {
            instance = new Leaderboard();
        }
        return instance;
    }
}

