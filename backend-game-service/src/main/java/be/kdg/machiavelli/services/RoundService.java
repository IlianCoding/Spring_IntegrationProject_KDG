package be.kdg.machiavelli.services;

import be.kdg.machiavelli.controllers.dto.CharacterDeckDto;
import be.kdg.machiavelli.controllers.dto.PlayerStateDto;
import be.kdg.machiavelli.controllers.mappers.CharacterDeckMapper;
import be.kdg.machiavelli.controllers.mappers.PlayerStateMapper;
import be.kdg.machiavelli.domain.*;
import be.kdg.machiavelli.controllers.dto.RoundDto;
import be.kdg.machiavelli.controllers.mappers.RoundMapper;
import be.kdg.machiavelli.domain.enums.RoundFase;
import be.kdg.machiavelli.exception.GameException;
import be.kdg.machiavelli.exception.RoundNotFoundException;
import be.kdg.machiavelli.repositories.RoundRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Comparator;
import java.util.List;
import java.util.UUID;

@Service
public class RoundService {
    private static final Logger logger = LoggerFactory.getLogger(RoundService.class);
    private final RoundRepository repository;
    private final GameService gameService;
    private final CharacterDeckService characterDeckService;
    private final PlayerStateService playerStateService;
    private final RoundMapper roundMapper;
    private final CharacterDeckMapper characterDeckMapper;
    private final CharacterService characterService;
    private final PlayerStateMapper playerStateMapper;

    public RoundService(RoundRepository roundRepository, GameService gameService, CharacterDeckService characterDeckService, PlayerStateService playerStateService, RoundMapper roundMapper, CharacterDeckMapper characterDeckMapper, CharacterService characterService, PlayerStateMapper playerStateMapper) {
        this.repository = roundRepository;
        this.gameService = gameService;
        this.characterDeckService = characterDeckService;
        this.roundMapper = roundMapper;
        this.playerStateService = playerStateService;
        this.characterDeckMapper = characterDeckMapper;
        this.characterService = characterService;
        this.playerStateMapper = playerStateMapper;
    }

    @Transactional
    protected List<Round> findAllRoundsByGame(UUID gameId) {
            Game game = gameService.findGameById(gameId);
            return repository.findRoundsByGame(game);
    }

    @Transactional
    public Round findLastRound(UUID gameId) {
        List<Round> rounds = findAllRoundsByGame(gameId);
        if (rounds == null || rounds.isEmpty()) {
            return null;
        }
        return rounds.stream().max(Comparator.comparing(Round::getCreatedAt)).orElse(null);
    }

    @Transactional
    public Player findKing(UUID gameId) {
        Player king = gameService.findKing(gameId);
        if (king == null) {
            Player player = findLastRound(gameId).getKing();
            playerStateService.updateIsKingPlayerState(player.getId());
            return player;
        } else {
            playerStateService.updateIsKingPlayerState(king.getId());
            return king;
        }
    }

    @Transactional
    public Round createRound(CharacterDeck characterDeck, Game game, Player king){
        gameService.resetPlayerStatesOfGame(game.getId());
        playerStateService.updateIsKingPlayerState(king.getId());
        try {
            Round round = new Round(false, RoundFase.CHARACTERCHOICEFASE, characterDeck, game, king);
            return repository.save(round);
        } catch (DataIntegrityViolationException ex) {
            throw new DataIntegrityViolationException(ex.getMessage());
        }
    }

    @Transactional
    public PlayerStateDto updatePlayerStateCharacter(UUID playerId, UUID characterId, UUID roundId) {
        GameCharacter gameCharacter = characterService.findCharacterById(characterId);
        PlayerState playerState = playerStateService.findPlayerStateByPlayerId(playerId);
        List<GameCharacter> gameCharacters = playerState.getCharacters();

        if (gameCharacters.size() == 2) {
            throw new GameException("Player already has 2 characters");
        }

        gameCharacters.add(gameCharacter);
        playerState.setCharacters(gameCharacters);
        updateRoundCharacters(roundId, characterId);
        return playerStateMapper.toDto(playerState);
    }

    @Transactional
    public void updateRoundCharacters(UUID roundId, UUID characterId) {
        Round round = repository.findById(roundId).orElseThrow(()-> new RoundNotFoundException("The round you are trying to find does niet exist."));
        CharacterDeck deck = round.getCharacterDeck();
        characterDeckService.removeCardFromCharacterDeck(deck, characterId);
    }

    @Transactional
    public RoundDto findRound(UUID roundId) {
        return roundMapper.toDto(repository.findById(roundId).orElseThrow(() -> new RoundNotFoundException("Round with id " + roundId + " was not found.")));
    }

    @Transactional
    public CharacterDeckDto findCharacterdeckOfRound(UUID roundId) {
        Round round = repository.findById(roundId).orElseThrow(()-> new RoundNotFoundException("The round you are trying to find does niet exist."));

        return characterDeckMapper.toDto(round.getCharacterDeck());
    }

    @Transactional
    public Round findTopByGameOrderByCreatedAtDesc(Game game) {
        return repository.findTopByGameOrderByCreatedAtDesc(game).orElseThrow(() -> new RoundNotFoundException("Round not found"));
    }

    @Transactional
    public Round saveRound(Round round) {
        return repository.save(round);
    }

    @Transactional
    public Round findRoundNonDto(UUID roundId) {
        return repository.findById(roundId).orElseThrow(() -> new RoundNotFoundException("Round with id " + roundId + " was not found."));
    }
}

