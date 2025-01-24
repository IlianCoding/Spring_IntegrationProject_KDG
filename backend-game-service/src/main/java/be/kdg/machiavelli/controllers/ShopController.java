package be.kdg.machiavelli.controllers;

import be.kdg.machiavelli.controllers.dto.GimmickDto;
import be.kdg.machiavelli.services.ShopService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/shop")
public class ShopController {

    private final ShopService shopService;

    public ShopController(ShopService shopService) {
        this.shopService = shopService;
    }

    @GetMapping("/gimmick/{gimmickId}")
    @PreAuthorize("hasAuthority('player')")
    public GimmickDto getGimmick(@PathVariable UUID gimmickId) {
        return shopService.findGimmickById(gimmickId);
    }

    @GetMapping("/gimmicks")
    @PreAuthorize("hasAuthority('player')")
    public List<GimmickDto> getGimmicks() {
        return shopService.findAllGimmicks();
    }

    @GetMapping("/active-gimmicks-of-player/{profileId}")
    @PreAuthorize("hasAuthority('player')")
    public List<GimmickDto> getActiveGimmicks(@PathVariable UUID profileId) {
        return shopService.findAllActiveGimmicksByProfile(profileId);
    }

    @GetMapping("/gimmicks-of-player/{profileId}")
    @PreAuthorize("hasAuthority('player')")
    public List<GimmickDto> getGimmicksOfPlayer(@PathVariable UUID profileId) {
        return shopService.findAllGimmicksByProfile(profileId);
    }

    @PutMapping("/{gimmickId}/purchase/{profileId}")
    @PreAuthorize("hasAuthority('player')")
    public GimmickDto purchaseGimmick(@PathVariable UUID gimmickId, @PathVariable UUID profileId) {
        return shopService.purchaseGimmick(gimmickId, profileId);
    }
}