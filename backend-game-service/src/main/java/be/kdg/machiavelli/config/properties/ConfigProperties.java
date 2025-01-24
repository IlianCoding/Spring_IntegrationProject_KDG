package be.kdg.machiavelli.config.properties;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Data
@Configuration
@ConfigurationProperties(prefix = "config")
public class ConfigProperties {

    private int achievementPro = 5;

    private int achievementExpert = 10;

    private int achievementSpeedrunner = 10;

    private int achievementHighRoller = 20;

    private int achievementMasterArchitect = 10;

    private int achievementHoarder = 10;

    private int achievementBeginnerArchitect = 10;

    private String email = "game.machiavelli@outlook.com";

    private String emailPersonal = "The Machiavelli team";

    private String aiEndpoint = "http://localhost:5000/";

    private int lobbyDifferential = 250;
}