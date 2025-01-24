package be.kdg.machiavelli.controllers.mappers;

import be.kdg.machiavelli.controllers.dto.AchievementDto;
import be.kdg.machiavelli.domain.Achievement;
import org.mapstruct.Mapper;
import org.springframework.stereotype.Component;

@Mapper(componentModel = "spring")
@Component
public interface AchievementMapper {
    AchievementDto toDto(Achievement achievement);

    Achievement toDomain(AchievementDto achievementDto);
}