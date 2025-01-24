package be.kdg.machiavelli.services;

import be.kdg.machiavelli.controllers.dto.GimmickDto;
import be.kdg.machiavelli.controllers.mappers.GimmickMapper;
import be.kdg.machiavelli.domain.Gimmick;
import be.kdg.machiavelli.domain.Profile;
import be.kdg.machiavelli.exception.GimmickAlreadyOwnedException;
import be.kdg.machiavelli.exception.GimmickNotFoundException;
import be.kdg.machiavelli.repositories.GimmickRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class ShopService {

    private final GimmickRepository gimmickRepository;
    private final ProfileService profileService;
    private final GimmickMapper gimmickMapper;

    public ShopService(GimmickRepository gimmickRepository, ProfileService profileService, GimmickMapper gimmickMapper) {
        this.gimmickRepository = gimmickRepository;
        this.profileService = profileService;
        this.gimmickMapper = gimmickMapper;
    }

    @Transactional
    public List<GimmickDto> findAllGimmicks() {
        return gimmickMapper.toDtos(gimmickRepository.findAll());
    }

    @Transactional
    public GimmickDto findGimmickById(UUID id) {
        Gimmick gimmick = gimmickRepository.findById(id)
                .orElseThrow(() -> new GimmickNotFoundException("Gimmick not found"));
        return gimmickMapper.toDto(gimmick);
    }

    @Transactional
    public List<GimmickDto> findAllGimmicksByProfile(UUID profileId) {
        List<Gimmick> gimmicks = gimmickRepository.findAll();
        Profile profile = profileService.findById(profileId);

        List<Gimmick> alreadyOwnedGimmicks = gimmicks.stream().filter(gimmick -> profile.getGimmicks().contains(gimmick)).toList();

        gimmicks.removeAll(alreadyOwnedGimmicks);
        return gimmickMapper.toDtos(gimmicks);
    }

    @Transactional
    public GimmickDto purchaseGimmick(UUID gimmickId, UUID profileId) {
        Gimmick gimmick = gimmickRepository.findById(gimmickId)
                .orElseThrow(() -> new GimmickNotFoundException("Gimmick not found"));
        Profile profile = profileService.findById(profileId);

        if (profile.getGimmicks().contains(gimmick)) {
            throw new GimmickAlreadyOwnedException("Gimmick already owned");
        }

        if (profile.getNumberOfLoyaltyPoints() >= gimmick.getNumberOfLoyaltyPoints()) {
            profile.getGimmicks().add(gimmick);
            profile.setNumberOfLoyaltyPoints(profile.getNumberOfLoyaltyPoints() - gimmick.getNumberOfLoyaltyPoints());
        }
        gimmickRepository.save(gimmick);
        return gimmickMapper.toDto(gimmick);
    }

    @Transactional
    public List<GimmickDto> findAllActiveGimmicksByProfile(UUID profileId) {
        return gimmickMapper.toDtos(profileService.getActiveGimmicksByProfileId(profileId));
    }
}