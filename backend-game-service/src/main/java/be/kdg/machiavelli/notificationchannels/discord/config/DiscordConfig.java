package be.kdg.machiavelli.notificationchannels.discord.config;

import lombok.Data;
import lombok.Getter;
import net.dv8tion.jda.api.JDA;
import net.dv8tion.jda.api.JDABuilder;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Getter
@Data
@Configuration
@ConfigurationProperties(prefix = "discord")
public class DiscordConfig {

    public String botToken = System.getenv("DISCORD_BOT_TOKEN");

    @Bean
    public JDA jda() {
        return JDABuilder.createDefault(botToken).build();
    }

}
