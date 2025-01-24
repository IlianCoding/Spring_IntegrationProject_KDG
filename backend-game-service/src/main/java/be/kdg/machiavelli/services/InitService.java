package be.kdg.machiavelli.services;

import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Component;

@Component
public class InitService {
    private GameEventService gameEventService;

    public InitService(GameEventService gameEventService) {
        this.gameEventService = gameEventService;
    }

    //TODO: uit commentaar halen
    /*@PostConstruct
    public void init() {
        gameEventService.generateMockDataGamePerDay();
        gameEventService.generateMockDataAvgGameTime();
    }*/
}
