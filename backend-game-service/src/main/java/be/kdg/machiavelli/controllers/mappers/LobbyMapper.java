package be.kdg.machiavelli.controllers.mappers;

import be.kdg.machiavelli.controllers.dto.LobbyDto;
import be.kdg.machiavelli.domain.Lobby;
import org.mapstruct.Mapper;
import org.springframework.stereotype.Component;

import java.util.List;

@Mapper(componentModel = "spring", uses = {ProfileMapper.class, PlayerStateMapper.class})
@Component
public interface LobbyMapper {
    LobbyDto toDto(Lobby lobby);

    Lobby toDomain(LobbyDto lobbyDto);

    List<LobbyDto> toDtos(List<Lobby> lobbies);
}