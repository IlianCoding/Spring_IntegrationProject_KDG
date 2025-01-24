package be.kdg.machiavelli.controllers.mappers;

import be.kdg.machiavelli.controllers.dto.GameDto;
import be.kdg.machiavelli.controllers.dto.OngoingGamesDto;
import be.kdg.machiavelli.domain.Game;
import org.mapstruct.Mapper;
import org.springframework.stereotype.Component;

import java.util.List;


@Mapper(componentModel = "spring", uses = {PlayerMapper.class, LobbyMapper.class, PlayerStateMapper.class, BuildingDeckMapper.class})
@Component
public interface GameMapper {
    GameDto toDto(Game game);

    Game toDomain(GameDto gameDto);

    List<GameDto> toDtos(List<Game> games);

    List<OngoingGamesDto> toOngoingGamesDtos(List<Game> games);
}
