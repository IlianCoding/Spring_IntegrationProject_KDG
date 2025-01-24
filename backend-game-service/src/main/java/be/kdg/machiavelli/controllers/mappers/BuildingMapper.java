package be.kdg.machiavelli.controllers.mappers;

import be.kdg.machiavelli.controllers.dto.BuildingDto;
import be.kdg.machiavelli.domain.Building;
import org.mapstruct.Mapper;
import org.springframework.stereotype.Component;

@Mapper(componentModel = "spring")
@Component
public interface BuildingMapper {
    BuildingDto toDto(Building building);


    Building toDomain(BuildingDto buildingDto);
}