package be.kdg.machiavelli.domain;

import be.kdg.machiavelli.domain.enums.RoundFase;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Data
@AllArgsConstructor
@EntityListeners(AuditingEntityListener.class)
public class Round {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    private boolean completed;
    @Enumerated(EnumType.STRING)
    private RoundFase fase;
    @CreatedDate
    private LocalDateTime createdAt;
    @ManyToOne(fetch = FetchType.LAZY)
    private CharacterDeck characterDeck;
    @ManyToOne(fetch = FetchType.LAZY)
    private Game game;
    @ManyToOne(fetch = FetchType.LAZY)
    private Player king;

    public Round() {
        
    }

    //TODO: nu localdatetime via .now(), maar moet via @createdDate
    public Round(boolean completed, RoundFase fase, CharacterDeck characterDeck, Game game, Player king) {
        this.completed=completed;
        this.fase=fase;
        this.characterDeck=characterDeck;
        this.game=game;
        this.createdAt=LocalDateTime.now();
        this.king=king;
    }
}
