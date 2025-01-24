package be.kdg.machiavelli.controllers.mappers;

import be.kdg.machiavelli.controllers.dto.TurnDto;
import be.kdg.machiavelli.domain.Turn;
import org.mapstruct.Mapper;
import org.springframework.stereotype.Component;

@Mapper(componentModel = "spring", uses = {PlayerStateMapper.class, RoundMapper.class})
@Component
public interface TurnMapper {
    TurnDto toDto(Turn turn);

    Turn toDomain(TurnDto turnDto);
}