package be.kdg.machiavelli.services;

import be.kdg.machiavelli.config.properties.ConfigProperties;
import be.kdg.machiavelli.controllers.dto.StatisticsRequestDto;
import be.kdg.machiavelli.controllers.dto.StatisticsResponseDto;
import be.kdg.machiavelli.controllers.dto.AiMessageDto;
import be.kdg.machiavelli.controllers.dto.ResponseDto;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Optional;
import java.util.List;

@Service
public class AiCommunicationService {
    private final RestTemplate restTemplate;
    private final String baseUrl;
    private static final Logger logger = LoggerFactory.getLogger(AiCommunicationService.class);

    public AiCommunicationService(RestTemplate restTemplate, ConfigProperties configProperties) {
        this.restTemplate = restTemplate;
        this.baseUrl = configProperties.getAiEndpoint();
    }

    public Optional<StatisticsResponseDto> getStatisticsPrediction(StatisticsRequestDto predictionRequest) {
        String url = baseUrl + "api/models/predict/statistics";
        try {
            StatisticsResponseDto response = restTemplate.postForObject(url, predictionRequest, StatisticsResponseDto.class);
            return Optional.ofNullable(response);
        } catch (Exception e) {
            return Optional.empty();
        }
    }
    public Optional<List<String>> getAllFaqMessagesFromAi() {
        String url = baseUrl + "/api/faqs/popular-questions";
        logger.debug("Requesting all FAQ messages from AI at URL: {}", url);

        try {
            ResponseDto faqMessages = restTemplate.getForObject(url, ResponseDto.class);
            logger.debug("Received FAQ messages data");
            return Optional.ofNullable(faqMessages != null ? faqMessages.response() : null);
        } catch (Exception e) {
            logger.error("Error retrieving FAQ messages from AI: {}", e.getMessage(), e);
            return Optional.empty();
        }
    }

    public Optional<String> getChatbotResponse(AiMessageDto messageRequest) {
        String url = baseUrl + "/api/chatbot/";
        logger.debug("Sending message to AI at URL: {}", url);

        try {
            String response = restTemplate.postForObject(url, messageRequest, String.class);
            logger.debug("Received response from AI: {}", response);
            return Optional.ofNullable(response);
        } catch (Exception e) {
            logger.error("Error sending message to AI: {}", e.getMessage(), e);
            return Optional.empty();
        }
    }
}