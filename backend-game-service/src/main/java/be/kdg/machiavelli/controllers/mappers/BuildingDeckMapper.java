package be.kdg.machiavelli.controllers.mappers;

import be.kdg.machiavelli.controllers.dto.BuildingDeckDto;
import be.kdg.machiavelli.domain.BuildingDeck;
import org.mapstruct.Mapper;
import org.springframework.stereotype.Component;

@Mapper(componentModel = "spring", uses = {BuildingMapper.class})
@Component
public interface BuildingDeckMapper {
    BuildingDeckDto toDto(BuildingDeck buildingDeck);

    BuildingDeck toDomain(BuildingDeckDto buildingDeckDto);
}
