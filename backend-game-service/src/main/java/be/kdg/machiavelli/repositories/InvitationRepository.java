package be.kdg.machiavelli.repositories;

import be.kdg.machiavelli.domain.Invitation;
import be.kdg.machiavelli.domain.Profile;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface InvitationRepository extends JpaRepository<Invitation, UUID> {
    List<Invitation> findInvitationsByReceiverAndAccepted(Profile receiver, boolean accepted);
}
