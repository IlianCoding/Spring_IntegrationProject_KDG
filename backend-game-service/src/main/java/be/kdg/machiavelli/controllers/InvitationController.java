package be.kdg.machiavelli.controllers;

import be.kdg.machiavelli.controllers.dto.InvitationDto;
import be.kdg.machiavelli.controllers.dto.LobbyDto;
import be.kdg.machiavelli.controllers.dto.LobbyInvitationDto;
import be.kdg.machiavelli.controllers.dto.SendInvitationDto;
import be.kdg.machiavelli.services.InvitationService;
import be.kdg.machiavelli.services.LobbyService;
import be.kdg.machiavelli.services.ProfileService;
import jakarta.mail.MessagingException;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.io.UnsupportedEncodingException;
import java.util.UUID;

@RestController
@RequestMapping("/api/invitations")
public class InvitationController {

    private final InvitationService invitationService;
    private final LobbyService lobbyService;
    private final ProfileService profileService;


    public InvitationController(InvitationService invitationService, LobbyService lobbyService, ProfileService profileService) {
        this.invitationService = invitationService;
        this.lobbyService = lobbyService;
        this.profileService = profileService;
    }

    @PostMapping("/send-by-name")
    @PreAuthorize("hasAuthority('player')")
    public InvitationDto sendInvitationByName(@RequestBody SendInvitationDto sendInvitationDto) {
        return invitationService.sendInvitationByUserName(sendInvitationDto.sender(), sendInvitationDto.receiver(), sendInvitationDto.lobbyId());
    }

    @PostMapping("/send-by-email")
    @PreAuthorize("hasAuthority('player')")
    public InvitationDto sendInvitationByEmail(@RequestBody SendInvitationDto sendInvitationDto) throws MessagingException, UnsupportedEncodingException {
        return invitationService.sendInvitationByEmail(sendInvitationDto.sender(), sendInvitationDto.receiver(), sendInvitationDto.lobbyId());
    }

    @PutMapping("/{invitationId}/accept")
    public LobbyDto acceptInvitation(@PathVariable UUID invitationId) {
        LobbyInvitationDto lobbyInvitationDto = invitationService.acceptInvitation(invitationId);
        lobbyService.addPlayer(lobbyInvitationDto.lobby().id(), lobbyInvitationDto.profileId());

        return lobbyInvitationDto.lobby();
    }

    @PostMapping("/send-invitation-by-discord")
    @PreAuthorize("hasAuthority('player')")
    public InvitationDto sendInvitationByDiscord(@RequestBody InvitationDto invitationDto) {
        return invitationService.sendInviteByDiscord(invitationDto);
    }
}
