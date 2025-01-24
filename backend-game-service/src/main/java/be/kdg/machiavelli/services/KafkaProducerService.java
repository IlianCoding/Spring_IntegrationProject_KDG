package be.kdg.machiavelli.services;

import be.kdg.machiavelli.domain.GameEvent;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
public class KafkaProducerService{
    private final KafkaTemplate<String, GameEvent> kafkaTemplate;

    public KafkaProducerService(KafkaTemplate<String, GameEvent> kafkaTemplate) {
        this.kafkaTemplate = kafkaTemplate;
    }

    public void sendMessage(String topic, GameEvent event) {
        kafkaTemplate.send(topic, event);
        System.out.println("Message sent: " + event);
    }
}
