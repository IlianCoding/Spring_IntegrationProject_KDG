package be.kdg.machiavelli.notificationchannels.discord;

import net.dv8tion.jda.api.entities.Member;
import net.dv8tion.jda.api.events.message.MessageReceivedEvent;
import net.dv8tion.jda.api.hooks.ListenerAdapter;

public class DirectMessage extends ListenerAdapter {

    public void onMessageReceived(MessageReceivedEvent event) {
        if (event.getMessage().getContentRaw().equalsIgnoreCase("!test")) {
            Member member = event.getMember();
            if (member != null) {
                member.getUser().openPrivateChannel().queue(privateChannel -> privateChannel.sendMessage("goeiemorgen mijn prins").queue());
            }
        }
    }
}
