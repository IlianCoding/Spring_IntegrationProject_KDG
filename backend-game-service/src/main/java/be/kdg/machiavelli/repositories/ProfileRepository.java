package be.kdg.machiavelli.repositories;

import be.kdg.machiavelli.domain.Profile;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface ProfileRepository extends JpaRepository<Profile, UUID> {
    Optional<Profile> findProfileByNameAndUserName(String name, String userName);

    Optional<Profile> findByName(String name);

    Optional<Profile> findByEmail(String email);

    boolean existsByEmail(String profileEmail);
}
