package be.kdg.machiavelli.controllers;

import be.kdg.machiavelli.controllers.dto.StatisticsRequestDto;
import be.kdg.machiavelli.controllers.dto.StatisticsResponseDto;
import be.kdg.machiavelli.services.AiCommunicationService;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin")
public class StatisticsPredictionController {
    private static final Logger logger = LoggerFactory.getLogger(StatisticsPredictionController.class);
    private final AiCommunicationService aiCommunicationService;

    public StatisticsPredictionController(AiCommunicationService aiCommunicationService) {
        this.aiCommunicationService = aiCommunicationService;
    }

    @PostMapping("/predict")
    @PreAuthorize("hasAuthority('admin')")
    public ResponseEntity<StatisticsResponseDto> predictStatistics(@Valid @RequestBody StatisticsRequestDto predictionRequest){
        logger.info("Received prediction request: {}", predictionRequest);
        return aiCommunicationService.getStatisticsPrediction(predictionRequest)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.internalServerError().build());
    }
}