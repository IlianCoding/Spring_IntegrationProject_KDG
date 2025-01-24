package be.kdg.machiavelli.services;

import be.kdg.machiavelli.TestcontainersConfiguration;
import be.kdg.machiavelli.controllers.dto.GimmickDto;
import be.kdg.machiavelli.domain.Gimmick;
import be.kdg.machiavelli.domain.Profile;
import be.kdg.machiavelli.exception.GimmickAlreadyOwnedException;
import be.kdg.machiavelli.repositories.GimmickRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;

import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@Import(TestcontainersConfiguration.class)
@SpringBootTest
class ShopServiceTest {

    @Autowired
    private ShopService shopService;

    @MockBean
    private GimmickRepository gimmickRepository;

    @MockBean
    private ProfileService profileService;

    private Profile profile;
    private Gimmick gimmick;

    @BeforeEach
    void setUp() {
        gimmick = new Gimmick();
        gimmick.setId(UUID.randomUUID());

        profile = new Profile();
        profile.setId(UUID.randomUUID());
        profile.setNumberOfLoyaltyPoints(100);
        List<Gimmick> gimmicks = new ArrayList<>();
        gimmicks.add(gimmick);
        gimmicks.add(new Gimmick());
        profile.setGimmicks(gimmicks);

        gimmick = new Gimmick();
        gimmick.setId(gimmick.getId());
        gimmick.setNumberOfLoyaltyPoints(50);
    }

    @Test
    void purchaseGimmick_shouldAddGimmickToProfileAndDeductPoints() {
        // Arrange
        when(gimmickRepository.findById(gimmick.getId())).thenReturn(Optional.of(gimmick));
        when(profileService.findById(profile.getId())).thenReturn(profile);
        when(gimmickRepository.save(gimmick)).thenReturn(gimmick);

        // Act
        GimmickDto result = shopService.purchaseGimmick(gimmick.getId(), profile.getId());

        // Assert
        assertNotNull(result);
        assertTrue(profile.getGimmicks().contains(gimmick));
        assertEquals(50, profile.getNumberOfLoyaltyPoints());
        verify(gimmickRepository).save(gimmick);
    }

    @Test
    void purchaseGimmick_shouldThrowExceptionWhenGimmickAlreadyOwned() {
        // Arrange
        profile.getGimmicks().add(gimmick);
        when(gimmickRepository.findById(gimmick.getId())).thenReturn(Optional.of(gimmick));
        when(profileService.findById(profile.getId())).thenReturn(profile);

        // Act & Assert
        assertThrows(GimmickAlreadyOwnedException.class, () -> shopService.purchaseGimmick(gimmick.getId(), profile.getId()));
    }
}