package be.kdg.machiavelli.services;

import be.kdg.machiavelli.TestcontainersConfiguration;
import be.kdg.machiavelli.domain.CharacterDeck;
import be.kdg.machiavelli.domain.GameCharacter;
import be.kdg.machiavelli.exception.CharacterDeckNotFoundException;
import be.kdg.machiavelli.exception.CharacterNotFoundException;
import be.kdg.machiavelli.exception.NoKingFoundException;
import be.kdg.machiavelli.repositories.CharacterDeckRepository;
import org.junit.jupiter.api.BeforeEach;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.junit.jupiter.api.Test;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.UUID;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;


@Import(TestcontainersConfiguration.class)
@SpringBootTest
class CharacterDeckServiceTest {

    @MockBean
    private CharacterDeckRepository characterDeckRepository;
    @MockBean
    private CharacterService characterService;

    @Autowired
    private CharacterDeckService characterDeckService;

    private CharacterDeck characterDeck;
    private List<GameCharacter> characters;
    private GameCharacter king;

    @BeforeEach
    void setUp() {
        king = new GameCharacter();
        king.setName("King");
        king.setId(UUID.randomUUID());

        GameCharacter thief = new GameCharacter();
        thief.setName("Thief");
        thief.setId(UUID.randomUUID());

        characters = new ArrayList<>(List.of(king, thief));
        characterDeck = new CharacterDeck(characters);
    }

    @Test
    void createCharacterDeck_shouldSaveNewCharacterDeck() {
        // Arrange
        when(characterService.findAllCharacters()).thenReturn(characters);
        when(characterDeckRepository.save(any(CharacterDeck.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // Act
        CharacterDeck result = characterDeckService.createCharacterDeck();

        // Assert
        assertNotNull(result);
        assertEquals(characters, result.getCharacters());
        verify(characterDeckRepository).save(any(CharacterDeck.class));
    }

    @Test
    void resetCharacterDeck_shouldUpdateCharacters() {
        // Arrange
        when(characterService.findAllCharacters()).thenReturn(characters);
        when(characterDeckRepository.save(any(CharacterDeck.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // Act
        CharacterDeck result = characterDeckService.resetCharacterDeck(characterDeck);

        // Assert
        assertEquals(characters, result.getCharacters());
        verify(characterDeckRepository).save(characterDeck);
    }

    @Test
    void resetCharacterDeck_shouldThrowExceptionIfCharactersNotFound() {
        // Arrange
        when(characterService.findAllCharacters()).thenReturn(Collections.emptyList());

        // Act & Assert
        assertThrows(CharacterNotFoundException.class, () -> characterDeckService.resetCharacterDeck(characterDeck));
    }

    @Test
    void shuffleCharacterDeck_shouldShuffleCharacters() {
        // Arrange
        when(characterService.findAllCharacters()).thenReturn(characters);
        when(characterDeckRepository.save(any(CharacterDeck.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // Act
        CharacterDeck result = characterDeckService.shuffleCharacterDeck(characterDeck);

        // Assert
        assertNotNull(result);
        assertEquals(characters.size(), result.getCharacters().size());
        verify(characterDeckRepository).save(characterDeck);
    }

    @Test
    void shuffleCharacterDeck_shouldThrowExceptionIfCharactersNotFound() {
        // Arrange
        when(characterService.findAllCharacters()).thenReturn(Collections.emptyList());

        // Act & Assert
        assertThrows(CharacterDeckNotFoundException.class, () -> characterDeckService.shuffleCharacterDeck(characterDeck));
    }

    @Test
    void prepareCharacterDeck_shouldEnsureKingIsPresent() {
        // Arrange
        when(characterService.findAllCharacters()).thenReturn(new ArrayList<>(characters));
        when(characterDeckRepository.save(any(CharacterDeck.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // Act
        CharacterDeck result = characterDeckService.prepareCharacterDeck(characterDeck, 4);

        // Assert
        assertNotNull(result);
        assertTrue(result.getCharacters().contains(king));
        verify(characterDeckRepository, atLeastOnce()).save(any(CharacterDeck.class));
    }

    @Test
    void prepareCharacterDeck_shouldThrowExceptionIfKingNotFound() {
        // Arrange
        List<GameCharacter> charactersWithoutKing = characters.stream()
                .filter(character -> !character.getName().equals("King"))
                .toList();

        when(characterService.findAllCharacters()).thenReturn(new ArrayList<>(charactersWithoutKing));

        // Act & Assert
        assertThrows(NoKingFoundException.class, () -> characterDeckService.prepareCharacterDeck(characterDeck, 4));
    }

    @Test
    void removeCardFromCharacterDeck_shouldRemoveCharacter() {
        // Arrange
        UUID characterId = king.getId();
        when(characterService.findCharacterById(characterId)).thenReturn(king);
        when(characterDeckRepository.save(any(CharacterDeck.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // Act
        characterDeckService.removeCardFromCharacterDeck(characterDeck, characterId);

        // Assert
        assertFalse(characterDeck.getCharacters().contains(king));
        verify(characterDeckRepository).save(characterDeck);
    }
}
