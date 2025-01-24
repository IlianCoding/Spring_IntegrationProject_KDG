package be.kdg.machiavelli.services;

import be.kdg.machiavelli.domain.Building;
import be.kdg.machiavelli.domain.BuildingDeck;
import be.kdg.machiavelli.exception.BuildingDeckException;
import be.kdg.machiavelli.repositories.BuildingDeckRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Service
public class BuildingDeckService {
    private final BuildingDeckRepository repository;
    private final BuildingService buildingService;

    public BuildingDeckService(BuildingDeckRepository repository, BuildingService buildingService) {
        this.repository = repository;
        this.buildingService = buildingService;
    }

    @Transactional
    public BuildingDeck createBuildingDeck() {
        List<Building> buildings = buildingService.findAllBuildings();
        if (buildings == null) throw new BuildingDeckException("Building deck has not been created");
        BuildingDeck buildingDeck = new BuildingDeck(buildings);
        buildingDeck = shuffle(buildingDeck);
        return repository.save(buildingDeck);
    }

    @Transactional
    public BuildingDeck shuffle(BuildingDeck buildingDeck) {
        List<Building> buildings = new ArrayList<>(buildingDeck.getBuildings());
        if (buildings.isEmpty()) {
            throw new BuildingDeckException("Building deck is empty and can't be shuffled.");
        }
        Collections.shuffle(buildings);
        buildingDeck.setBuildings(buildings);
        return repository.save(buildingDeck);
    }

    @Transactional
    public BuildingDeck reset(BuildingDeck buildingDeck) {
        List<Building> buildings = buildingService.findAllBuildings();
        if (buildings == null) {throw new BuildingDeckException("Building deck has not been reset");}
        buildingDeck.setBuildings(buildings);
        return repository.save(buildingDeck);
    }

    @Transactional
    public List<Building> takeNumberOfBuildingsFromBuildingDeck(int numberOfBuildings, BuildingDeck buildingDeck) {
        List<Building> buildings = buildingDeck.getBuildings();
        if (buildings == null || buildings.isEmpty()) {
            throw new BuildingDeckException("Building deck does not exist or is empty");
        }
        if (numberOfBuildings > buildings.size()) {
            throw new BuildingDeckException("There are too many buildings");
        }

        List<Building> takenBuildings = new ArrayList<>(buildings.subList(0, numberOfBuildings));
        buildings.removeAll(takenBuildings);
        buildingDeck.setBuildings(buildings);

        repository.save(buildingDeck);

        return takenBuildings;
    }


    @Transactional
    public List<Building> drawBuildings(int amount, BuildingDeck buildingDeck) {
        List<Building> drawnBuildings = new ArrayList<>(buildingDeck.getBuildings().subList(0, amount));
        buildingDeck.getBuildings().removeAll(drawnBuildings);
        return drawnBuildings;
    }

    @Transactional
    public void putBackBuilding(Building buildingToPutBack, BuildingDeck buildingDeck) {
        buildingDeck.getBuildings().add(buildingToPutBack);
    }


}
