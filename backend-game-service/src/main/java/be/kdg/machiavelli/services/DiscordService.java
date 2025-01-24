package be.kdg.machiavelli.services;

import be.kdg.machiavelli.domain.Invitation;
import be.kdg.machiavelli.domain.Profile;
import be.kdg.machiavelli.notificationchannels.discord.DirectMessage;
import be.kdg.machiavelli.notificationchannels.discord.config.DiscordConfig;
import net.dv8tion.jda.api.JDA;
import net.dv8tion.jda.api.JDABuilder;
import net.dv8tion.jda.api.entities.Activity;
import net.dv8tion.jda.api.entities.User;
import net.dv8tion.jda.api.requests.GatewayIntent;
import org.springframework.stereotype.Service;
import java.util.logging.Level;
import java.util.logging.Logger;

@Service
public class DiscordService {


    private final DiscordConfig config = new DiscordConfig();
    JDABuilder jdaBuilder = JDABuilder.createDefault(config.getBotToken(), GatewayIntent.GUILD_MESSAGES, GatewayIntent.MESSAGE_CONTENT, GatewayIntent.GUILD_MEMBERS).setActivity(Activity.listening("test"));
    JDA jda = config.jda();
    private final Logger logger = Logger.getLogger(DiscordService.class.getName());

    public void setUp() {
        jda = jdaBuilder.build();
        jdaBuilder.addEventListeners(new DirectMessage());

        try {
            jda.awaitReady();
        } catch(InterruptedException e) {
            logger.log(Level.SEVERE, "Interrupted while waiting for JDA to start", e);
        }
    }

    public void onTurn(String username, String message) {
        User user = getUser(username);

        if (user != null) {
            user.openPrivateChannel().queue(privateChannel -> privateChannel.sendMessage(message).queue(
                    success -> logger.log(Level.INFO, "Message sent to " + username),
                    error -> logger.log(Level.INFO, "Failed to send message: " + error.getMessage())
            ));
        } else {
            logger.log(Level.INFO, "User not found: " + username);
        }
    }


    public void sendInvite(Profile profile, Invitation invitation) {
        String username = profile.getDiscord();
        User user = getUser(username);

        if (user != null) {
            user.openPrivateChannel().queue(privateChannel -> privateChannel.sendMessage(invitation.getSender().getUserName() + " sends you an invite. Click here to join: " + invitation.getUrl()).queue(
                    success -> logger.log(Level.INFO, "Message sent to " + username),
                    error -> logger.log(Level.INFO, "Failed to send message: " + error.getMessage())
            ));
        } else {
            logger.log(Level.INFO, "User not found: " + username);
        }
    }

    private User getUser(String username) {
        return jda.getUserCache().stream()
                .filter(u -> u.getName().equalsIgnoreCase(username))
                .findFirst()
                .orElse(null);
    }
}
