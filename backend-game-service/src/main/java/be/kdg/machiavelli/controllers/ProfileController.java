package be.kdg.machiavelli.controllers;

import be.kdg.machiavelli.controllers.dto.FriendDto;
import be.kdg.machiavelli.controllers.dto.ProfileDto;
import be.kdg.machiavelli.controllers.dto.ProfilePostDto;
import be.kdg.machiavelli.services.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/profiles")
public class ProfileController {

    private final ProfileService profileService;
    private final LanguageService languageService;
    private static final Logger logger = LoggerFactory.getLogger(ProfileController.class);


    public ProfileController(ProfileService profileService, LanguageService languageService) {
        this.profileService = profileService;
        this.languageService = languageService;
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('player')")
    public ProfileDto getProfile(@PathVariable UUID id) {
        logger.debug("Getting profile with id: {}", id);
        return profileService.findDtoById(id);
    }

    @PostMapping("/register")
    @PreAuthorize("hasAuthority('player')")
    public ResponseEntity<ProfilePostDto> createProfile(@RequestBody ProfilePostDto profilePostDto) {
        ProfilePostDto profile = profileService.createProfile(profilePostDto.id(), profilePostDto.name(), profilePostDto.userName(), profilePostDto.birthday(), profilePostDto.channel(), profilePostDto.email());
        if(profile == null){
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.ok(profile);
    }

    @GetMapping
    @PreAuthorize("hasAuthority('player')")
    public List<ProfileDto> getProfiles() {
        logger.debug("Getting all profiles");
        return profileService.findAll();
    }

    @PutMapping("/{id}/avatar")
    @PreAuthorize("hasAuthority('player')")
    public void setAvatarUrl(@PathVariable UUID id, @RequestBody String avatarUrl) {
        logger.debug("Setting avatarUrl for profile with id: {}", id);
        profileService.setAvatarUrl(id, avatarUrl);
    }

    @PutMapping("")
    @PreAuthorize("hasAuthority('player')")
    public void updateProfile(@RequestBody ProfileDto profileDto) {
        logger.debug("Updating profile with id: {}", profileDto.id());
        profileService.updateProfile(profileDto);
    }

    @PutMapping("/{id}/friends/{friendId}")
    @PreAuthorize("hasAuthority('player')")
    public void addFriend(@PathVariable UUID id, @PathVariable UUID friendId) {
        logger.debug("Adding friend with id: {} to profile with id: {}", friendId, id);
        profileService.addFriend(id, friendId);
    }

    @DeleteMapping("/{id}/friends/{friendId}")
    @PreAuthorize("hasAuthority('player')")
    public void removeFriend(@PathVariable UUID id, @PathVariable UUID friendId) {
        logger.debug("Removing friend with id: {} from profile with id: {}", friendId, id);
        profileService.removeFriend(id, friendId);
    }

    @GetMapping("/friend/{name}/{userName}")
    @PreAuthorize("hasAuthority('player')")
    public FriendDto getFriendProfile(@PathVariable String name, @PathVariable String userName) {
        logger.debug("Getting friend profile with name: {} and userName: {}", name, userName);
        return profileService.getFriendProfile(name, userName);
    }

    @PutMapping("/{profileId}/activate-gimmick/{gimmickId}")
    @PreAuthorize("hasAuthority('player')")
    public void activateGimmick(@PathVariable UUID profileId, @PathVariable UUID gimmickId) {
        logger.debug("Activating gimmick with id: {} for profile with id: {}", gimmickId, profileId);
        profileService.activateGimmick(profileId, gimmickId);
    }

    @PutMapping("/{profileId}/deactivate-gimmick/{gimmickId}")
    @PreAuthorize("hasAuthority('player')")
    public void deactivateGimmick(@PathVariable UUID profileId, @PathVariable UUID gimmickId) {
        logger.debug("Deactivating gimmick with id: {} for profile with id: {}", gimmickId, profileId);
        profileService.deactivateGimmick(profileId, gimmickId);
    }

    @PutMapping("{profileId}/locale/{localeString}")
    @PreAuthorize("hasAuthority('player')")
    public void updateLocale(@PathVariable UUID profileId, @PathVariable String localeString) {
        logger.debug("Updating locale for profile with id: {}", profileId);
        languageService.updateLocale(profileId, localeString);
    }

    @GetMapping("/exists/{profileEmail}")
    @PreAuthorize("hasAuthority('player')")
    public ResponseEntity<Boolean> userExists(@PathVariable String profileEmail){
        if(profileEmail == null){
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.ok().body(profileService.existProfileByEmail(profileEmail));
    }
}
