package be.kdg.machiavelli.notificationchannels.email;
import be.kdg.machiavelli.config.properties.ConfigProperties;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;


@Service
public class EmailSender {

    @Autowired
    private final JavaMailSender mailSender;
    private final ConfigProperties configProperties = new ConfigProperties();

    public EmailSender(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }


    public void sendEmail(String to, String subject, String text) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(configProperties.getEmail());
        message.setTo(to);
        message.setSubject(subject);
        message.setText(text);
        mailSender.send(message);
    }
}