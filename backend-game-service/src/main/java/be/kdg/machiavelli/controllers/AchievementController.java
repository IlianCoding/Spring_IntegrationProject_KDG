package be.kdg.machiavelli.controllers;

import be.kdg.machiavelli.controllers.dto.AchievementDto;
import be.kdg.machiavelli.services.AchievementService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/achievements")
public class AchievementController {

    private final AchievementService achievementService;
    private static final Logger logger = LoggerFactory.getLogger(AchievementController.class);

    public AchievementController(AchievementService achievementService) {
        this.achievementService = achievementService;
    }

    @GetMapping("")
    @PreAuthorize("hasAuthority('player')")
    public List<AchievementDto> findAllAchievements() {
        logger.debug("Getting all achievements");
        return achievementService.findAll();
    }


}
