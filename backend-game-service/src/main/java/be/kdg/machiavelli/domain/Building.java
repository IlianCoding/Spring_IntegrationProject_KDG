package be.kdg.machiavelli.domain;

import be.kdg.machiavelli.domain.enums.Color;
import jakarta.persistence.*;
import lombok.Data;
import java.util.UUID;

@Entity
@Data
public class Building {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    private String name;
    private int cost;
    @Enumerated(EnumType.STRING)
    private Color color;
    private int number;
    private String imgUrl;
}
