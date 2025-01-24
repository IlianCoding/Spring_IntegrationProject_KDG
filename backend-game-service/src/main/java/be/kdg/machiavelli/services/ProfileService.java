package be.kdg.machiavelli.services;

import be.kdg.machiavelli.controllers.dto.FriendDto;
import be.kdg.machiavelli.controllers.dto.ProfileDto;
import be.kdg.machiavelli.controllers.dto.ProfilePostDto;
import be.kdg.machiavelli.controllers.mappers.ProfileMapper;
import be.kdg.machiavelli.controllers.mappers.ProfilePostMapper;
import be.kdg.machiavelli.domain.*;
import be.kdg.machiavelli.domain.enums.GimmickType;
import be.kdg.machiavelli.exception.GimmickNotFoundException;
import be.kdg.machiavelli.exception.GimmickNotOwnedException;
import be.kdg.machiavelli.domain.enums.Channel;
import be.kdg.machiavelli.exception.ProfileNotFoundException;
import be.kdg.machiavelli.repositories.GimmickRepository;
import be.kdg.machiavelli.repositories.ProfileRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class ProfileService {
    private static final Logger logger = LoggerFactory.getLogger(ProfileService.class);
    private final ProfileRepository profileRepository;
    private final ProfileMapper profileMapper;
    private final ProfilePostMapper profilePostMapper;
    private final PlayerService playerService;
    private final PlayerStateService playerStateService;
    private final GimmickRepository gimmickRepository;

    public ProfileService(ProfileRepository profileRepository, ProfileMapper profileMapper, PlayerService playerService, ProfilePostMapper profilePostMapper, PlayerStateService playerStateService, GimmickRepository gimmickRepository) {
        this.profileRepository = profileRepository;
        this.profileMapper = profileMapper;
        this.profilePostMapper = profilePostMapper;
        this.playerService = playerService;
        this.playerStateService = playerStateService;
        this.gimmickRepository = gimmickRepository;
    }

    @Transactional
    public Profile findById(UUID id) {
        logger.debug("Finding profile with id: {}", id);
        return profileRepository.findById(id)
                .orElseThrow(() -> new ProfileNotFoundException("Profile with id: " + id + " not found"));
    }

    @Transactional
    public ProfileDto findDtoById(UUID id) {
        logger.debug("Finding profile with id: {}", id);
        return profileMapper.toDto(profileRepository.findById(id)
                .orElseThrow(() -> new ProfileNotFoundException("Profile with id: " + id + " not found")));
    }

    @Transactional
    public Profile findByName(String name) {
        return profileRepository.findByName(name)
                .orElseThrow(() -> new ProfileNotFoundException("Profile with name: " + name + " not found"));
    }

    @Transactional
    public Profile findByEmail(String email) {
        return profileRepository.findByEmail(email)
                .orElseThrow(() -> new ProfileNotFoundException("Profile with email: " + email + " not found"));
    }

    @Transactional
    public List<ProfileDto> findAll() {
        logger.debug("Finding all profiles");
        return profileRepository.findAll().stream()
                .map(profileMapper::toDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public void setAvatarUrl(UUID id, String avatarUrl) {
        logger.debug("Setting avatarUrl for profile with id: {}", id);
        Profile profile = profileRepository.findById(id).orElseThrow(() -> new ProfileNotFoundException("Profile not found"));
        profile.setAvatarUrl(avatarUrl);
        profileRepository.save(profile);
    }

    @Transactional
    public void updateProfile(ProfileDto profileDto) {
        logger.debug("Updating profile with id: {}", profileDto.id());
        Profile profile = profileRepository.findById(profileDto.id()).orElseThrow(() -> new ProfileNotFoundException("Profile not found"));
        profile.setName(profileDto.name());
        profile.setBirthday(profileDto.birthday());
        profile.setChannel(profileDto.channel());
        profileRepository.save(profile);
    }

    @Transactional
    public void addFriend(UUID profileId, UUID friendId) {
        logger.debug("Adding friend with id: {} to profile with id: {}", friendId, profileId);
        Profile profile = profileRepository.findById(profileId).orElseThrow(() -> new ProfileNotFoundException("Profile not found"));
        Profile friend = profileRepository.findById(friendId).orElseThrow(() -> new ProfileNotFoundException("Friend profile not found"));

        if (profile.getFriends().contains(friend)) {
            logger.debug("Friend with id: {} is already added to profile with id: {}", friendId, profileId);
            return;
        }

        profile.getFriends().add(friend);
        profileRepository.save(profile);
    }

    @Transactional
    public void removeFriend(UUID profileId, UUID friendId) {
        logger.debug("Removing friend with id: {} from profile with id: {}", friendId, profileId);
        Profile profile = profileRepository.findById(profileId).orElseThrow(() -> new ProfileNotFoundException("Profile not found"));
        Profile friend = profileRepository.findById(friendId).orElseThrow(() -> new ProfileNotFoundException("Friend profile not found"));
        profile.getFriends().remove(friend);
        profileRepository.save(profile);
    }

    @Transactional
    public FriendDto getFriendProfile(String name, String userName) {
        logger.debug("Getting friend profile with name: {} and userName: {}", name, userName);
        Profile profile = profileRepository.findProfileByNameAndUserName(name, userName)
                .orElseThrow(() -> new ProfileNotFoundException("Friend profile not found"));
        return profileMapper.toFriendDto(profile);
    }

    @Transactional
    public List<PlayerState> findPlayerStates(UUID profileId) {
        Profile profile = profileRepository.findById(profileId)
                .orElseThrow(() -> new ProfileNotFoundException("Profile not found"));
        List<Player> players = playerService.findPlayersByProfile(profile);
        List<PlayerState> playerStates = new ArrayList<>();
        for (Player player : players) {
            PlayerState playerState = playerStateService.findPlayerStateByPlayerId(player.getId());
            playerStates.add(playerState);
        }
        return playerStates;
    }

    @Transactional
    public void activateGimmick(UUID profileId, UUID gimmickId) {
        Profile profile = profileRepository.findById(profileId)
                .orElseThrow(() -> new GimmickNotFoundException("Profile not found"));
        Gimmick gimmick = gimmickRepository.findById(gimmickId)
                .orElseThrow(() -> new GimmickNotFoundException("Gimmick not found"));

        checkGimmickOwnership(profile, gimmick);
        checkGimmickExclusivity(profile, gimmick);

        List<Gimmick> ActiveGimmicks = profile.getActiveGimmicks();
        ActiveGimmicks.add(gimmick);
        profile.setActiveGimmicks(ActiveGimmicks);

        profileRepository.save(profile);
    }

    @Transactional
    public void deactivateGimmick(UUID profileId, UUID gimmickId) {
        Profile profile = profileRepository.findById(profileId)
                .orElseThrow(() -> new GimmickNotFoundException("Profile not found"));
        Gimmick gimmick = gimmickRepository.findById(gimmickId)
                .orElseThrow(() -> new GimmickNotFoundException("Gimmick not found"));

        checkGimmickOwnership(profile, gimmick);

        List<Gimmick> ActiveGimmicks = profile.getActiveGimmicks();
        ActiveGimmicks.remove(gimmick);
        profile.setActiveGimmicks(ActiveGimmicks);
        profileRepository.save(profile);
    }

    private void checkGimmickOwnership(Profile profile, Gimmick gimmick) {
        if (!profile.getGimmicks().contains(gimmick)) {
            throw new GimmickNotOwnedException("Gimmick not owned by profile");
        }
    }

    private void checkGimmickExclusivity(Profile profile, Gimmick gimmick) {
        if (gimmick.getType() == GimmickType.SOUND) {
            String character = extractCharacterFromName(gimmick.getName());
            for (Gimmick activeGimmick : profile.getActiveGimmicks()) {
                if (activeGimmick.getType() == GimmickType.SOUND && extractCharacterFromName(activeGimmick.getName()).equals(character)) {
                    throw new IllegalStateException("A gimmick with the same character is already active");
                }
            }
        } else if (gimmick.getType() == GimmickType.BACKGROUNDCOLOR) {
            for (Gimmick activeGimmick : profile.getActiveGimmicks()) {
                if (activeGimmick.getType() == GimmickType.BACKGROUNDCOLOR) {
                    throw new IllegalStateException("A background color gimmick is already active");
                }
            }
        }
    }

    private String extractCharacterFromName(String name) {
        return name.split(":")[1].trim();
    }
    @Transactional
    public ProfilePostDto createProfile(UUID uuid, String name, String userName, LocalDate birthday, Channel channel, String email){
        Profile profile = new Profile(uuid, name, userName, birthday, channel, email);
        return profilePostMapper.toDto(profileRepository.save(profile));
    }

    public boolean existProfileByEmail(String profileEmail) {
        return profileRepository.existsByEmail(profileEmail);
    }

    @Transactional
    public List<Gimmick> getActiveGimmicksByProfileId(UUID profileId) {
        Profile profile = profileRepository.findById(profileId)
                .orElseThrow(() -> new ProfileNotFoundException("Profile not found"));
        return profile.getActiveGimmicks();
    }
}

