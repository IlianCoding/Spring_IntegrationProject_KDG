package be.kdg.machiavelli.domain;

import jakarta.persistence.*;
import lombok.Data;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Data
@EntityListeners(AuditingEntityListener.class)
public class Tournament {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    private String name;
    @CreatedDate
    private LocalDateTime createdAt;
    private boolean open;
    @OneToMany
    private List<Lobby> lobbies;
    @OneToOne(fetch = FetchType.LAZY)
    private TournamentSettings settings;

    public Tournament() {
    }

    public Tournament(String name, boolean open, TournamentSettings settings) {
        this.name = name;
        this.open = open;
        this.settings = settings;
        this.lobbies = new ArrayList<>();
    }
}
