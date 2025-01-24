package be.kdg.machiavelli.services;

import be.kdg.machiavelli.TestcontainersConfiguration;
import be.kdg.machiavelli.domain.Building;
import be.kdg.machiavelli.domain.BuildingDeck;
import be.kdg.machiavelli.exception.BuildingDeckException;
import be.kdg.machiavelli.repositories.BuildingDeckRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import java.util.ArrayList;
import java.util.List;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;


@Import(TestcontainersConfiguration.class)
@SpringBootTest
public class BuildingDeckServiceTest {
    @MockBean
    private BuildingService buildingService;

    @MockBean
    private BuildingDeckRepository repository;

    @Autowired
    private BuildingDeckService buildingDeckService;


    @Test
    void createBuildingDeck_shouldCreateAndShuffleDeck() {
        // Arrange
        Building building1 = new Building();
        Building building2 = new Building();
        List<Building> buildings = List.of(building1, building2);
        when(buildingService.findAllBuildings()).thenReturn(buildings);

        BuildingDeck buildingDeck = new BuildingDeck(buildings);
        when(repository.save(any(BuildingDeck.class))).thenReturn(buildingDeck);

        // Act
        BuildingDeck createdDeck = buildingDeckService.createBuildingDeck();

        // Assert
        assertNotNull(createdDeck);
        assertEquals(2, createdDeck.getBuildings().size());
        verify(repository, times(2)).save(any(BuildingDeck.class));
    }

    @Test
    void createBuildingDeck_shouldThrowExceptionWhenBuildingsNull() {
        // Arrange
        when(buildingService.findAllBuildings()).thenReturn(null);

        // Act/Assert
        assertThrows(BuildingDeckException.class, buildingDeckService::createBuildingDeck);
    }

    @Test
    void shuffle_shouldShuffleDeck() {
        // Arrange
        Building building1 = new Building();
        Building building2 = new Building();
        List<Building> buildings = List.of(building1, building2);
        BuildingDeck buildingDeck = new BuildingDeck(new ArrayList<>(buildings));
        when(repository.save(any(BuildingDeck.class))).thenReturn(buildingDeck);

        // Act
        BuildingDeck shuffledDeck = buildingDeckService.shuffle(buildingDeck);

        // Assert
        assertNotNull(shuffledDeck);
        assertEquals(2, shuffledDeck.getBuildings().size());
        verify(repository, times(1)).save(buildingDeck);
    }

    @Test
    void takeNumberOfBuildingsFromBuildingDeck_shouldTakeBuildings() {
        // Arrange
        Building building1 = new Building();
        Building building2 = new Building();
        List<Building> buildings = List.of(building1, building2);
        BuildingDeck buildingDeck = new BuildingDeck(new ArrayList<>(buildings));
        when(repository.save(any(BuildingDeck.class))).thenReturn(buildingDeck);

        // Act
        List<Building> takenBuildings = buildingDeckService.takeNumberOfBuildingsFromBuildingDeck(2, buildingDeck);

        // Assert
        assertEquals(2, takenBuildings.size());
        assertEquals(0, buildingDeck.getBuildings().size());
        verify(repository, times(1)).save(buildingDeck);
    }

    @Test
    void takeNumberOfBuildingsFromBuildingDeck_shouldThrowExceptionWhenTooManyBuildingsRequested() {
        // Arrange
        Building building1 = new Building();
        List<Building> buildings = List.of(building1);
        BuildingDeck buildingDeck = new BuildingDeck(new ArrayList<>(buildings));

        // Act & Assert
        assertThrows(BuildingDeckException.class,
                () -> buildingDeckService.takeNumberOfBuildingsFromBuildingDeck(2, buildingDeck));
    }

    @Test
    void putBackBuilding_shouldAddBuildingToDeck() {
        // Arrange
        Building building1 = new Building();
        Building building2 = new Building();
        Building building3 = new Building();
        Building building4 = new Building();
        List<Building> buildings = new ArrayList<>(){{add(building1);add(building2);add(building3);}};
        BuildingDeck buildingDeck = new BuildingDeck(buildings);

        // Act
        buildingDeckService.putBackBuilding(building4, buildingDeck);

        // Assert
        assertEquals(4, buildingDeck.getBuildings().size());
        assertTrue(buildingDeck.getBuildings().contains(building2));
    }
}
