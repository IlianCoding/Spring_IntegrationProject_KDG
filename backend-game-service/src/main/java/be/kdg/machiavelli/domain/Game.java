package be.kdg.machiavelli.domain;

import jakarta.persistence.*;
import lombok.Data;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Entity
@Data
@EntityListeners(AuditingEntityListener.class)
public class Game {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    private int turnDuration;
    @CreatedDate
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private int coinsInBank;
    private int numberOfRounds;
    private boolean completed;
    @ManyToOne(fetch = FetchType.LAZY)
    private Player winner;
    @ManyToOne(fetch = FetchType.LAZY)
    private Lobby lobby;
    @ManyToMany
    private List<PlayerState> playerStates;
    @ManyToOne(fetch = FetchType.LAZY)
    private BuildingDeck buildingDeck;

    @Override
    public String toString() {
        return "Game{" +
                "id=" + id +
                ", turnDuration=" + turnDuration +
                ", startTime=" + startTime +
                ", endTime=" + endTime +
                ", coinsInBank=" + coinsInBank +
                ", numberOfRounds=" + numberOfRounds +
                ", completed=" + completed +
                ", Winner=" + winner +
                ", lobby=" + lobby +
                ", buildingDeck=" + buildingDeck +
                '}';
    }

    public Game() {
    }

    public Game(int turnDuration, int coinsInBank, BuildingDeck buildingDeck) {
        this.turnDuration = turnDuration;
        this.coinsInBank = coinsInBank;
        this.numberOfRounds = 0;
        this.completed = false;
        this.winner = null;
        this.buildingDeck = buildingDeck;
    }

}
