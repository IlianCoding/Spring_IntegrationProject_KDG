package be.kdg.machiavelli.domain;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Entity
public class PlayerScore {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    private UUID playerId;
    private String userName;
    private UUID gameId;
    private LocalDateTime gameDate;
    private int rank;
    private int score;
    private UUID profileId;


    public PlayerScore(UUID playerId, String userName, UUID gameId, LocalDateTime gameDate, int score, UUID profileId) {
        this.playerId = playerId;
        this.userName = userName;
        this.gameId = gameId;
        this.gameDate = gameDate;
        this.score = score;
        this.profileId = profileId;
    }

    public PlayerScore() {

    }


    @Override
    public String toString() {
        return "PlayerScore{" +
                "rank=" + rank +
                ", userName='" + userName + '\'' +
                ", score=" + score +
                ", gameId='" + gameId + '\'' +
                ", gameDate=" + gameDate +
                ", profileId=" + profileId +
                '}';
    }
}
