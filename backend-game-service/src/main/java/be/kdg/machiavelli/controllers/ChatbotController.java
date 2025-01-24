package be.kdg.machiavelli.controllers;

import be.kdg.machiavelli.controllers.dto.AiMessageDto;
import be.kdg.machiavelli.services.AiCommunicationService;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.List;

@Controller
@RequestMapping("/api/chatbot")
public class ChatbotController {

    private final AiCommunicationService aiCommunicationService;

    public ChatbotController(AiCommunicationService aiCommunicationService) {
        this.aiCommunicationService = aiCommunicationService;
    }

    @GetMapping("/popular-questions")
    public ResponseEntity<List<String>> chatbot() {
        return aiCommunicationService.getAllFaqMessagesFromAi()
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.noContent().build());
    }

    @PostMapping("")
    public ResponseEntity<String> sendMessageToChatbot(@RequestBody AiMessageDto messageRequest) {
        return aiCommunicationService.getChatbotResponse(messageRequest)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.noContent().build());
    }
}