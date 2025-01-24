package be.kdg.machiavelli.domain;

import be.kdg.machiavelli.domain.enums.GameEventType;
import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Data
public class GameEvent {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    private GameEventType gameEventType;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss.SSS")
    private LocalDateTime startDateTime;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss.SSS")
    private LocalDateTime endDateTime;
    private double duration;
    private UUID gameId;

    public GameEvent() {
    }

    public GameEvent(GameEventType gameEventType, LocalDateTime startDateTime, LocalDateTime endDateTime, double duration) {
        this.id = UUID.randomUUID();
        this.gameEventType = gameEventType;
        this.startDateTime = startDateTime;
        this.endDateTime = endDateTime;
        this.duration = duration;
        this.gameId = UUID.randomUUID();
    }

    public GameEvent(GameEventType type, LocalDateTime startDateTime) {
        this.id = UUID.randomUUID();
        this.gameEventType = type;
        this.startDateTime = startDateTime;
        this.gameId = UUID.randomUUID();
    }
}
