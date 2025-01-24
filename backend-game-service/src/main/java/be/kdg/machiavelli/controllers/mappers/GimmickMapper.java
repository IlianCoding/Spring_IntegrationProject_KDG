package be.kdg.machiavelli.controllers.mappers;

import be.kdg.machiavelli.controllers.dto.GimmickDto;
import be.kdg.machiavelli.domain.Gimmick;
import org.mapstruct.Mapper;
import org.springframework.stereotype.Component;

import java.util.List;

@Mapper(componentModel = "spring")
@Component
public interface GimmickMapper {
    GimmickDto toDto(Gimmick gimmick);

    Gimmick toDomain(GimmickDto gimmickDto);

    List<GimmickDto> toDtos(List<Gimmick> gimmicks);
}