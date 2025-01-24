package be.kdg.machiavelli.domain;

import be.kdg.machiavelli.domain.enums.Channel;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.UUID;

@Entity
@Data
public class Profile {
    @Id
    //@GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    private String userName;
    private String name;
    private int numberOfLoyaltyPoints;
    private LocalDate birthday;
    private String avatarUrl;
    @Enumerated(EnumType.STRING)
    private Channel channel;
    @ManyToMany
    private List<Profile> friends;
    @ManyToMany
    private List<Achievement> achievements;
    @ManyToMany
    private List<Gimmick> gimmicks;
    @ManyToMany
    private List<Gimmick> activeGimmicks;
    @NotNull
    private String email;
    private Locale locale;
    private String discord;

    public Profile(UUID uuid, String name, String userName, LocalDate birthday, Channel channel, String email) {
        this.id= uuid;
        this.name= name;
        this.userName= userName;
        this.birthday= birthday;
        this.channel= channel;
        this.email= email;
        this.numberOfLoyaltyPoints=0;
        this.friends=new ArrayList<>();
        this.gimmicks=new ArrayList<>();
        this.achievements=new ArrayList<>();
        this.locale=new Locale.Builder()
                .setLanguage("en")
                .setRegion("UK")
                .build();
    }

    public Profile() {

    }
}
