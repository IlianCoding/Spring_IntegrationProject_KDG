package be.kdg.machiavelli.services;

import be.kdg.machiavelli.domain.Building;
import be.kdg.machiavelli.exception.BuildingNotFoundException;
import be.kdg.machiavelli.repositories.BuildingRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class BuildingService {
    private final BuildingRepository repository;

    public BuildingService(BuildingRepository repository) {
        this.repository = repository;
    }

    public List<Building> findAllBuildings(){
        return repository.findAll();
    }

    public Building findBuildingById(UUID id) {
        return repository.findById(id).orElseThrow(() -> new BuildingNotFoundException("Building not found"));
    }

    public List<Building> findBuildingsByIds(List<UUID> ids) {
        return repository.findAllById(ids);
    }
}
