package be.kdg.machiavelli.services;

import be.kdg.machiavelli.domain.CharacterDeck;
import be.kdg.machiavelli.domain.GameCharacter;
import be.kdg.machiavelli.exception.CharacterDeckNotFoundException;
import be.kdg.machiavelli.exception.CharacterNotFoundException;
import be.kdg.machiavelli.exception.NoKingFoundException;
import be.kdg.machiavelli.repositories.CharacterDeckRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.Collections;
import java.util.List;
import java.util.UUID;

@Service
public class CharacterDeckService {
    private final CharacterDeckRepository repository;
    private final CharacterService characterService;

    public CharacterDeckService(CharacterDeckRepository characterDeckRepository, CharacterService characterService) {
        this.repository = characterDeckRepository;
        this.characterService = characterService;
    }

    @Transactional
    public CharacterDeck createCharacterDeck(){
        List<GameCharacter> characters = characterService.findAllCharacters();
        return  repository.save(new CharacterDeck(characters));

    }

    @Transactional
    public CharacterDeck resetCharacterDeck(CharacterDeck characterDeck) {
        List<GameCharacter> characters = characterService.findAllCharacters();
        if ( characters == null || characters.isEmpty()) throw new CharacterNotFoundException("Characters not found");
        characterDeck.setCharacters(characters);
        return repository.save(characterDeck);
    }

    @Transactional
    public CharacterDeck shuffleCharacterDeck(CharacterDeck characterDeck) {
        List<GameCharacter> characters = characterService.findAllCharacters();
        if (characters == null || characters.isEmpty()) throw new CharacterDeckNotFoundException("Game characters not found");
        Collections.shuffle(characters);
        characterDeck.setCharacters(characters);
        return repository.save(characterDeck);
    }

    @Transactional
    public CharacterDeck prepareCharacterDeck(CharacterDeck characterDeck, int amountOfPlayers) {
        characterDeck = shuffleCharacterDeck(characterDeck);
        List<GameCharacter> characters = characterService.findAllCharacters();
        Collections.shuffle(characters);
        GameCharacter king = characters.stream()
                .filter(gameCharacter -> gameCharacter.getName().equals("King"))
                .findAny()
                .orElseThrow(() -> new NoKingFoundException("There is no king in this deck."));

        boolean kingPresent = characters.contains(king);

        while (!kingPresent) {
            switch (amountOfPlayers) {
                case 4:
                    characters.removeFirst();
                    characters.removeFirst();
                    break;
                case 5:
                    characters.removeFirst();
                    break;
                case 3:
                case 6:
                case 7:
                    return characterDeck;
            }

            kingPresent = characters.contains(king);
            if (!kingPresent) {
                characterDeck = resetCharacterDeck(characterDeck);
                characters = characterService.findAllCharacters();
                Collections.shuffle(characters);
            }
        }

        characterDeck.setCharacters(characters);
        return characterDeck;
    }

    @Transactional
    public void removeCardFromCharacterDeck(CharacterDeck characterDeck, UUID characterId){
        GameCharacter character = characterService.findCharacterById(characterId);
        List<GameCharacter> characters = characterDeck.getCharacters();
        characters.remove(character);
        characterDeck.setCharacters(characters);
        repository.save(characterDeck);
    }
}
