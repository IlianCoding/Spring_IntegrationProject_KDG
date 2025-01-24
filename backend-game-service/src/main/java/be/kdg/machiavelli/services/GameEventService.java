package be.kdg.machiavelli.services;

import be.kdg.machiavelli.domain.GameEvent;
import be.kdg.machiavelli.domain.enums.GameEventType;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.Random;

@Service
public class GameEventService {
    private final KafkaProducerService kafkaProducerService;

    public GameEventService(KafkaProducerService kafkaProducerService) {
        this.kafkaProducerService = kafkaProducerService;
    }

    public void generateMockDataGamePerDay(){
        Random random = new Random();
        LocalDateTime dateTime = LocalDateTime.now();
        for (int i = 0; i < 10 ; i++) {
            int randomSeconds = random.nextInt(7 * 24 * 60 * 60);
            LocalDateTime startDateTime = dateTime.minusSeconds(randomSeconds);
            GameEvent gameEvent = new GameEvent(GameEventType.game_start,startDateTime);
            kafkaProducerService.sendMessage("game_event",gameEvent);
        }
    }

    public void generateMockDataAvgGameTime(){
        Random random = new Random();
        LocalDateTime dateTime = LocalDateTime.now();
        for (int i = 0; i < 10 ; i++) {
            int randomSeconds = random.nextInt(7 * 24 * 60 * 60);
            LocalDateTime startDateTime = dateTime.minusSeconds(randomSeconds);
            int randomMinutes = random.nextInt(21) + 20;
            LocalDateTime endDateTime = dateTime.plusMinutes(randomMinutes);
            Duration duration = Duration.between(startDateTime,endDateTime);
            GameEvent gameEvent = new GameEvent(GameEventType.game_end,startDateTime,endDateTime,duration.toMinutes());
            kafkaProducerService.sendMessage("game_event",gameEvent);
        }
    }


}
