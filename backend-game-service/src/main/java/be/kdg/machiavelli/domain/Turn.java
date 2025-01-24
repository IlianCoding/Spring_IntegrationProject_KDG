package be.kdg.machiavelli.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@EntityListeners(AuditingEntityListener.class)
public class Turn {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    @ElementCollection
    private Set<String> completedFases;
    private boolean completed;
    @CreatedDate
    private LocalDateTime createdAt;
    @ManyToOne(fetch = FetchType.LAZY)
    private Round round;
    @ManyToOne(fetch = FetchType.LAZY)
    private PlayerState playerState;
    private boolean hasDrawnBuilding;
    private int amountOfBuildingsBuiltThisTurn;
    String notification;

    //todo: nu localdatetime via .now(), maar moet via @createdDate
    public Turn(Round round, PlayerState playerState) {
        completedFases = new HashSet<>();
        completed = false;
        this.round = round;
        this.playerState = playerState;
        this.createdAt=LocalDateTime.now();
        hasDrawnBuilding = false;
        amountOfBuildingsBuiltThisTurn = 0;
    }
}
