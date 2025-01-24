package be.kdg.machiavelli.controllers.mappers;

import be.kdg.machiavelli.controllers.dto.RoundDto;
import be.kdg.machiavelli.domain.Round;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.springframework.stereotype.Component;

@Mapper(componentModel = "spring", uses = {GameMapper.class, PlayerMapper.class})
@Component
public interface RoundMapper {
    @Mapping(target = "king", source = "king")
    RoundDto toDto(Round round);

    @Mapping(target = "king", source = "king")
    Round toDomain(RoundDto roundDto);
}
