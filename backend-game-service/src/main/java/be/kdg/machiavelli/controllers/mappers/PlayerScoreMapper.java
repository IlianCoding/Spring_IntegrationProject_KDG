package be.kdg.machiavelli.controllers.mappers;

import be.kdg.machiavelli.controllers.dto.PlayerScoreDto;
import be.kdg.machiavelli.domain.PlayerScore;
import org.mapstruct.Mapper;
import org.springframework.stereotype.Component;
import java.util.List;

@Mapper(componentModel = "spring")
@Component
public interface PlayerScoreMapper {

    PlayerScoreDto toDto(PlayerScore playerScore);

    PlayerScore toDomain(PlayerScoreDto playerScoreDto);

    List<PlayerScoreDto> toDtos(List<PlayerScore> playerScores);
}
