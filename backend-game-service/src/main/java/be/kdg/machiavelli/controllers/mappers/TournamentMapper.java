package be.kdg.machiavelli.controllers.mappers;

import be.kdg.machiavelli.controllers.dto.TournamentDto;
import be.kdg.machiavelli.domain.Tournament;
import org.mapstruct.Mapper;
import org.springframework.stereotype.Component;

@Mapper(componentModel = "spring", uses = {TournamentSettingsMapper.class})
@Component
public interface TournamentMapper {
    TournamentDto toDto(Tournament tournament);

    Tournament toDomain(TournamentDto tournamentDto);
}
