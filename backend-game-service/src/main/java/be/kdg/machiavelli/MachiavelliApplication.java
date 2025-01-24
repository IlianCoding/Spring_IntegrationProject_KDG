package be.kdg.machiavelli;

import be.kdg.machiavelli.services.DiscordService;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class MachiavelliApplication {

    public static void main(String[] args) {
        SpringApplication.run(MachiavelliApplication.class, args);
        DiscordService discordService = new DiscordService();
        discordService.setUp();
    }

}
