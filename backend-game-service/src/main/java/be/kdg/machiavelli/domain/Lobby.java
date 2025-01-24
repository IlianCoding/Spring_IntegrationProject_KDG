package be.kdg.machiavelli.domain;

import jakarta.persistence.*;
import lombok.Data;

import java.util.List;
import java.util.UUID;

@Entity
@Data
public class Lobby {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    private boolean open;
    private int number;
    @ManyToMany
    private List<Profile> profiles;
    @ManyToOne(fetch = FetchType.LAZY)
    private Tournament tournament;
    private int averageLoyaltyPoints;
    private UUID ownerId;
}
