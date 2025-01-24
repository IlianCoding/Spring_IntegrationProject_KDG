package be.kdg.machiavelli.controllers.mappers;

import be.kdg.machiavelli.controllers.dto.CharacterDto;
import be.kdg.machiavelli.domain.GameCharacter;
import org.mapstruct.Mapper;
import org.springframework.stereotype.Component;

@Mapper(componentModel = "spring")
@Component
public interface CharacterMapper {
    CharacterDto toDto(GameCharacter character);

    GameCharacter toDomain(CharacterDto characterDto);
}