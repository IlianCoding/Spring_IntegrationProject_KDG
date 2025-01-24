package be.kdg.machiavelli.controllers.mappers;

import be.kdg.machiavelli.controllers.dto.AchievementDto;
import be.kdg.machiavelli.controllers.dto.CharacterDeckDto;
import be.kdg.machiavelli.controllers.dto.CharacterDto;
import be.kdg.machiavelli.domain.Achievement;
import be.kdg.machiavelli.domain.CharacterDeck;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface CharacterDeckMapper {
    CharacterDeckDto toDto(CharacterDeck characterDeck);

    CharacterDeck toDomain(CharacterDeckDto characterDeckDto);
}
