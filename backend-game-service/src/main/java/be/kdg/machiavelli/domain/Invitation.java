package be.kdg.machiavelli.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.UUID;

@Data
@Entity
@AllArgsConstructor
public class Invitation {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;
    @ManyToOne
    private Profile sender;
    @ManyToOne
    private Profile receiver;
    private UUID lobbyId;
    private boolean accepted;
    private String url;

    public Invitation() {
    }

    public Invitation(UUID id, Profile sender, Profile receiver, UUID lobbyId, boolean accepted) {
        this.id = id;
        this.sender = sender;
        this.receiver = receiver;
        this.lobbyId = lobbyId;
        this.accepted = accepted;
    }
}
