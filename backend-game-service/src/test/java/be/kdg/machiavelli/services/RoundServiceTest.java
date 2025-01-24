package be.kdg.machiavelli.services;

import be.kdg.machiavelli.TestcontainersConfiguration;
import be.kdg.machiavelli.controllers.dto.CharacterDeckDto;
import be.kdg.machiavelli.controllers.dto.RoundDto;
import be.kdg.machiavelli.domain.*;
import be.kdg.machiavelli.domain.enums.RoundFase;
import be.kdg.machiavelli.repositories.RoundRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;


@Import(TestcontainersConfiguration.class)
@SpringBootTest
class RoundServiceTest {

    @Autowired
    private RoundService roundService;

    @MockBean
    private RoundRepository roundRepository;

    @MockBean
    private GameService gameService;

    @MockBean
    private CharacterDeckService characterDeckService;

    @MockBean
    private PlayerStateService playerStateService;

    private UUID gameId;
    private UUID roundId;
    private Round round;
    private Game game;
    private Player king;
    private CharacterDeck characterDeck;

    @BeforeEach
    void setUp() {
        gameId = UUID.randomUUID();
        roundId = UUID.randomUUID();

        game = new Game();
        game.setId(gameId);

        king = new Player();
        king.setId(UUID.randomUUID());

        characterDeck = new CharacterDeck();

        round = new Round(false, RoundFase.CHARACTERCHOICEFASE, characterDeck, game, king);
        round.setId(roundId);
    }

    @Test
    void findLastRound_shouldReturnLastRound() {
        // Arrange
        List<Round> rounds = List.of(round);
        when(gameService.findGameById(gameId)).thenReturn(game);
        when(roundRepository.findRoundsByGame(game)).thenReturn(rounds);

        // Act
        Round result = roundService.findLastRound(gameId);

        // Assert
        assertNotNull(result);
        assertEquals(round, result);
        verify(roundRepository).findRoundsByGame(game);
    }

    @Test
    void findKing_shouldReturnKingFromGameService() {
        // Arrange
        when(gameService.findKing(gameId)).thenReturn(king);

        // Act
        Player result = roundService.findKing(gameId);

        // Assert
        assertNotNull(result);
        assertEquals(king, result);
        verify(playerStateService).updateIsKingPlayerState(king.getId());
    }

    @Test
    void findKing_shouldReturnKingFromLastRound() {
        // Arrange
        when(gameService.findKing(gameId)).thenReturn(null);
        when(roundRepository.findRoundsByGame(game)).thenReturn(List.of(round));
        when(gameService.findGameById(gameId)).thenReturn(game);

        // Act
        Player result = roundService.findKing(gameId);

        // Assert
        assertNotNull(result);
        assertEquals(king, result);
        verify(playerStateService).updateIsKingPlayerState(king.getId());
    }

    @Test
    void findCharacterdeckOfRound_shouldReturnCharacterDeckDto() {
        // Arrange
        when(roundRepository.findById(roundId)).thenReturn(Optional.of(round));

        // Act
        CharacterDeckDto result = roundService.findCharacterdeckOfRound(roundId);

        // Assert
        assertNotNull(result);
        verify(roundRepository).findById(roundId);
    }

    @Test
    void updateRoundCharacters_shouldRemoveCharacterAndReturnRoundDto() {
        // Arrange
        UUID characterId = UUID.randomUUID();
        CharacterDeck deck = round.getCharacterDeck();
        when(roundRepository.findById(roundId)).thenReturn(Optional.of(round));

        // Act
        roundService.updateRoundCharacters(roundId, characterId);

        // Assert
        verify(characterDeckService).removeCardFromCharacterDeck(deck, characterId);
    }
}