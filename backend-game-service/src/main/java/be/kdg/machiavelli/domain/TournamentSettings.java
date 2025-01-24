package be.kdg.machiavelli.domain;

import jakarta.persistence.*;
import lombok.Data;

import java.util.UUID;

@Entity
@Data
public class TournamentSettings {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    private int playersPerLobby;
    private int maxNumberOfPlayers;
}
