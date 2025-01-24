package be.kdg.machiavelli.services;

import be.kdg.machiavelli.controllers.dto.InvitationDto;
import be.kdg.machiavelli.controllers.dto.LobbyInvitationDto;
import be.kdg.machiavelli.controllers.mappers.InvitationMapper;
import be.kdg.machiavelli.controllers.mappers.LobbyMapper;
import be.kdg.machiavelli.domain.Invitation;
import be.kdg.machiavelli.domain.Lobby;
import be.kdg.machiavelli.domain.Profile;
import be.kdg.machiavelli.domain.enums.Channel;
import be.kdg.machiavelli.exception.InvitationNotFoundException;
import be.kdg.machiavelli.notificationchannels.email.EmailSender;
import be.kdg.machiavelli.repositories.InvitationRepository;
import org.springframework.mail.javamail.JavaMailSenderImpl;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.UUID;

@Service
public class InvitationService {

    private final ProfileService profileService;
    private final InvitationMapper invitationMapper;
    private final JavaMailSenderImpl mailSender = new JavaMailSenderImpl();
    private final EmailSender emailSender = new EmailSender(mailSender);
    private final InvitationRepository invitationRepository;
    private final LobbyService lobbyService;
    private final LobbyMapper lobbyMapper;
    private final DiscordService discordService;


    public InvitationService(ProfileService profileService, InvitationMapper invitationMapper, InvitationRepository invitationRepository, LobbyService lobbyService, LobbyMapper lobbyMapper, DiscordService discordService)  {
        this.profileService = profileService;
        this.invitationMapper = invitationMapper;
        this.invitationRepository = invitationRepository;
        this.lobbyService = lobbyService;
        this.lobbyMapper = lobbyMapper;
        this.discordService = discordService;
    }


    public InvitationDto sendInvitationByUserName(UUID senderId, String receiverName, UUID lobbyId) {
        Profile sender = profileService.findById(senderId);
        Profile receiver = profileService.findByName(receiverName);
        Invitation invitation = new Invitation(UUID.randomUUID(), sender, receiver, lobbyId, false);
        //TODO: redirect in-game?

        sendInvitationViaPreferredChannel(invitation);

        return invitationMapper.toDto(invitation);
    }

    public InvitationDto sendInvitationByEmail(UUID senderId, String receiverEmail, UUID lobbyId) {
        Profile sender = profileService.findById(senderId);
        // TODO: Create URL that redirects to the lobby/invitation
        Profile receiver = profileService.findByEmail(receiverEmail);

        Invitation invitation = new Invitation(UUID.randomUUID() ,sender, receiver, lobbyId, false);
        sendInvitationViaEmail(invitation);

        return invitationMapper.toDto(invitation);
    }

    public LobbyInvitationDto acceptInvitation(UUID invitationId) {
        Invitation invitation = invitationRepository.findById(invitationId)
                .orElseThrow(() -> new InvitationNotFoundException("Invitation not found"));

        Lobby lobby = lobbyService.findById(invitation.getLobbyId());
        invitation.setAccepted(true);
        return new LobbyInvitationDto(lobbyMapper.toDto(lobby), invitation.getReceiver().getId());
    }

    public List<Invitation> findAllOpenInvitationsByReceiver(UUID receiverId) {
        Profile receiver = profileService.findById(receiverId);
        return invitationRepository.findInvitationsByReceiverAndAccepted(receiver, false);
    }

    private void sendInvitationViaEmail(Invitation invitation) {
        Profile sender = invitation.getSender();
        String receiverEmail = invitation.getReceiver().getEmail();

        String lobbyUrl = "http://localhost:8080/lobbies/" + invitation.getLobbyId();

        String subject = "New Invitation - Machiavelli";
        String content = "<p>Hello,</p><p>You have been invited to play a game of Machiavelli by " + sender.getUserName() + " .</p>"
                + "<p>Click <a href=\"" + lobbyUrl + "\">here</a> to join the lobby.</p>";

        emailSender.sendEmail(receiverEmail, subject, content);
    }

    private void sendInvitationViaDiscord(Invitation invitation) {
        Profile receiver = invitation.getReceiver();
        discordService.sendInvite(receiver, invitation);
    }

    private void sendInvitationViaPreferredChannel(Invitation invitation) {
        Profile receiver = invitation.getReceiver();
        Channel channel = receiver.getChannel();

        switch (channel) {
            case DISCORD -> sendInvitationViaDiscord(invitation);
            case Channel.MAIL -> sendInvitationViaEmail(invitation);
        }
    }

    public InvitationDto sendInviteByDiscord(InvitationDto invitationDto) {
        Invitation invitation = invitationMapper.toDomain(invitationDto);
        discordService.sendInvite(invitation.getReceiver(), invitation);
        return invitationMapper.toDto(invitation);
    }
}
