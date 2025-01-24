package be.kdg.machiavelli.domain;
import be.kdg.machiavelli.domain.enums.Color;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class GameCharacter {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    private String name;
    private int number;
    private String image;
    @Enumerated(EnumType.STRING)
    private Color color;
    private String description;
}
