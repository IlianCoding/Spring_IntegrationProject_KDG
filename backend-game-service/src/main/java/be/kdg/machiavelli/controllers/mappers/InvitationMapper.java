package be.kdg.machiavelli.controllers.mappers;

import be.kdg.machiavelli.controllers.dto.InvitationDto;
import be.kdg.machiavelli.domain.Invitation;
import org.mapstruct.Mapper;
import org.springframework.stereotype.Component;

import java.util.List;

@Mapper(componentModel = "spring", uses = {ProfileMapper.class})
@Component
public interface InvitationMapper {

    InvitationDto toDto(Invitation invitation);

    Invitation toDomain(InvitationDto invitationDto);

    List<InvitationDto> toDtos(List<Invitation> invitations);
}
