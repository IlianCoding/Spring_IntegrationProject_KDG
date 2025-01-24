package be.kdg.machiavelli.controllers.mappers;

import be.kdg.machiavelli.controllers.dto.PlayerStateDto;
import be.kdg.machiavelli.domain.PlayerState;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.springframework.stereotype.Component;

@Mapper(componentModel = "spring", uses = {PlayerMapper.class, ProfileMapper.class, CharacterMapper.class, BuildingMapper.class})
@Component
public interface PlayerStateMapper {

    @Mapping(target = "isKing", source = "king")
    PlayerStateDto toDto(PlayerState playerState);

    @Mapping(target = "king", source = "isKing")
    PlayerState toDomain(PlayerStateDto playerStateDto);

}