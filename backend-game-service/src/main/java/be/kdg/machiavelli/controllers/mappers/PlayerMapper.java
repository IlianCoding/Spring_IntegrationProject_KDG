package be.kdg.machiavelli.controllers.mappers;

import be.kdg.machiavelli.controllers.dto.PlayerDto;
import be.kdg.machiavelli.domain.Player;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.springframework.stereotype.Component;

import java.util.List;

@Mapper(componentModel = "spring", uses = {ProfileMapper.class})
@Component
public interface PlayerMapper {
    PlayerDto toDto(Player player);

    Player toDomain(PlayerDto playerDto);

    List<PlayerDto> toDtos(List<Player> players);
}
