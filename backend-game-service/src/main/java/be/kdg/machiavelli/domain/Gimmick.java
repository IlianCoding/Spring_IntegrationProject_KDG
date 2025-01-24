package be.kdg.machiavelli.domain;

import be.kdg.machiavelli.domain.enums.GimmickType;
import jakarta.persistence.*;
import lombok.Data;
import java.util.UUID;

@Entity
@Data
public class Gimmick {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    private String name;
    private int numberOfLoyaltyPoints;
    @Enumerated(EnumType.STRING)
    private GimmickType type;
}
