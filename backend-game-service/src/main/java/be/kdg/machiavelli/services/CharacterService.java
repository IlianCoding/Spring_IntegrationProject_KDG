package be.kdg.machiavelli.services;
import be.kdg.machiavelli.domain.enums.Color;
import be.kdg.machiavelli.domain.GameCharacter;
import be.kdg.machiavelli.exception.CharacterNotFoundException;
import be.kdg.machiavelli.repositories.CharacterRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class CharacterService {

    private final CharacterRepository repository;

    public CharacterService(CharacterRepository characterRepository) {
        this.repository = characterRepository;
    }

    public List<GameCharacter> findAllCharacters(){
        return repository.findAll();
    }

    public GameCharacter findCharacterById(UUID characterId) {
        return repository.findById(characterId).orElseThrow(()-> new CharacterNotFoundException("The character you are trying to find does not exist"));
    }
}
