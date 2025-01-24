package be.kdg.machiavelli.controllers.mappers;

import be.kdg.machiavelli.controllers.dto.ProfileDto;
import be.kdg.machiavelli.controllers.dto.ProfilePostDto;
import be.kdg.machiavelli.domain.Profile;
import org.mapstruct.Mapper;
import org.springframework.stereotype.Component;

@Mapper(componentModel = "spring", uses = {AchievementMapper.class, GimmickMapper.class})
@Component
public interface ProfilePostMapper {
    ProfilePostDto toDto(Profile profile);
}
