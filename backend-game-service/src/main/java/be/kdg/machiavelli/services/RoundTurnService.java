package be.kdg.machiavelli.services;

import be.kdg.machiavelli.domain.*;
import be.kdg.machiavelli.domain.enums.RoundFase;
import be.kdg.machiavelli.domain.enums.TurnFase;
import be.kdg.machiavelli.exception.*;
import be.kdg.machiavelli.repositories.TurnRepository;
import org.springframework.context.MessageSource;
import org.springframework.orm.jpa.JpaTransactionManager;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.support.TransactionTemplate;

import java.time.LocalDateTime;
import java.util.*;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

@Service
public class RoundTurnService {

    private final GameService gameService;
    private final CharacterDeckService characterDeckService;
    private final RoundService roundService;
    private final ScheduledExecutorService scheduler = Executors.newScheduledThreadPool(1);
    private final TurnRepository turnRepository;
    private final PlayerStateService playerStateService;
    private final JpaTransactionManager transactionManager;
    private final LeaderboardService leaderboardService;
    private final MessageSource messageSource;
    private final AchievementService achievementService;
    private final DiscordService discordService;


    public RoundTurnService(GameService gameService, CharacterDeckService characterDeckService, RoundService roundService, TurnRepository turnRepository, PlayerStateService playerStateService, JpaTransactionManager transactionManager, LeaderboardService leaderboardService, MessageSource messageSource, AchievementService achievementService, DiscordService discordService) {
        this.gameService = gameService;
        this.characterDeckService = characterDeckService;
        this.roundService = roundService;
        this.turnRepository = turnRepository;
        this.playerStateService = playerStateService;
        this.transactionManager = transactionManager;
        this.leaderboardService = leaderboardService;
        this.messageSource = messageSource;
        this.achievementService = achievementService;
        this.discordService = discordService;
    }

    @Transactional
    public Round prepareNewRound(UUID gameId) {
        Game game = gameService.findGameById(gameId);
        gameService.updateNumberOfRoundsOfGame(gameId);
        List<Round> rounds = roundService.findAllRoundsByGame(gameId);
        if (rounds != null && rounds.isEmpty()) {
            Player player = gameService.findOldestPlayer(gameId);
            return roundService.createRound(characterDeckService.createCharacterDeck(), game, player);
        } else {
            Round lastRound = roundService.findLastRound(gameId);
            Player player = roundService.findKing(gameId);
            return roundService.createRound(characterDeckService.prepareCharacterDeck(lastRound.getCharacterDeck(), gameService.findAmountOfPlayers(gameId)), game, player);
        }
    }

    @Transactional
    public void createNewTurn(UUID gameId, int nextCharacterNumber) {
        createNewTurn(gameId, nextCharacterNumber, UUID.randomUUID());
    }

    @Transactional
    public void createNewTurn(UUID gameId, int nextCharacterNumber, UUID nextPlayerStateId) {
        Game game = gameService.findGameById(gameId);

        List<PlayerState> playerStates = game.getPlayerStates();

        Round round = roundService.findTopByGameOrderByCreatedAtDesc(game);
        Turn turn;
        PlayerState playerState;

        // this statement only ever runs at the start of a round
        if ((round.getFase() == RoundFase.CHARACTERCHOICEFASE && nextCharacterNumber == 1)) {
            //nextPlayerStateId is the king but we don't need to use that here.
            GameCharacter kingCharacter = round.getCharacterDeck().getCharacters().stream()
                    .filter(character -> character.getNumber() == 4)
                    .findFirst()
                    .orElseThrow(() -> new IllegalArgumentException("King character not found in the character deck"));

            round.getCharacterDeck().getCharacters().remove(kingCharacter);
            playerState = playerStateService.findPlayerStateByPlayer(round.getKing().getId());
            playerState.getCharacters().add(kingCharacter);
            playerStateService.save(playerState);
            roundService.saveRound(round);
        } else if (round.getFase() == RoundFase.CHARACTERCHOICEFASE) {
            playerState = playerStates.stream()
                    .filter(ps -> ps.getId().equals(nextPlayerStateId))
                    .findFirst()
                    .orElseThrow(() -> new PlayerStateNotFoundException("PlayerState with id " + nextPlayerStateId + " not found"));
        } else {
            playerState = playerStates.stream()
                    .filter(ps -> ps.getCharacters().stream().anyMatch(character -> character.getNumber() == nextCharacterNumber))
                    .findFirst()
                    .orElseThrow(() -> new PlayerStateNotFoundException("PlayerState with character number " + nextCharacterNumber + " not found"));

        }

        turn = new Turn(round, playerState);
        String notificationMessage = messageSource.getMessage(
                "turn.notification",
                new Object[]{playerState.getPlayer().getProfile().getUserName()},
                playerState.getPlayer().getProfile().getLocale()
        );
        sendDiscordNotification(turn.getPlayerState().getPlayer().getProfile().getDiscord(), notificationMessage);
        turn.setNotification(notificationMessage);

        roundService.saveRound(round);
        Turn savedTurn = saveTurn(turn);
        if (playerState.isAssassinated()) {
            endTurn(savedTurn.getId());
        } else {
            startTurnCountdown(savedTurn.getId(), game.getTurnDuration());
        }
    }

    @Transactional
    public String getCharacterName(int characterNumber) {
        return switch (characterNumber) {
            case 1 -> "Murderer";
            case 2 -> "Thief";
            case 3 -> "Magician";
            case 4 -> "King";
            case 5 -> "Bishop";
            case 6 -> "Merchant";
            case 7 -> "Architect";
            case 8 -> "Warlord";
            default -> throw new IllegalArgumentException("Invalid character number: " + characterNumber);
        };
    }

    @Transactional
    public UUID findNextPlayerStateInCharacterChoicePhase(UUID gameId, Player currentPlayer) {
        Game game = gameService.findGameById(gameId);
        List<PlayerState> playerStates = game.getPlayerStates();
        PlayerState currentPlayerState = playerStateService.findPlayerStateByPlayer(currentPlayer.getId());
        int currentIndex = playerStates.indexOf(currentPlayerState);
        int requiredCharacters = playerStates.size() == 3 ? 2 : 1;

        for (int i = 1; i <= playerStates.size(); i++) {
            int nextIndex = (currentIndex + i) % playerStates.size();
            PlayerState nextPlayerState = playerStates.get(nextIndex);
            if (nextPlayerState.getCharacters().size() < requiredCharacters) {
                return nextPlayerState.getId();
            }
        }

        throw new IllegalStateException("No player found with fewer than the required characters");
    }

    @Transactional
    public int findNextCharacterPlayer(Turn turn) {
        Game game = turn.getRound().getGame();
        List<PlayerState> playerStates = game.getPlayerStates();

        List<GameCharacter> allCharacters = playerStates.stream()
                .flatMap(playerState -> playerState.getCharacters().stream())
                .toList();

        List<GameCharacter> allCharactersThatHavePlayed = playerStates.stream()
                .flatMap(playerState -> playerState.getCharactersThatHavePlayed().stream())
                .toList();

        int nextCharacterNumber = allCharacters.stream()
                .filter(character -> !allCharactersThatHavePlayed.contains(character))
                .min(Comparator.comparingInt(GameCharacter::getNumber))
                .map(GameCharacter::getNumber)
                .orElse(-1);
        if (nextCharacterNumber == -1) {
            String notificationMessage = messageSource.getMessage(
                    "turn.all.characters.played",
                    null,
                    turn.getPlayerState().getPlayer().getProfile().getLocale()
            );
            turn.setNotification(notificationMessage);
            return nextCharacterNumber;
        }

        String notificationMessage = messageSource.getMessage(
                "turn.next.character",
                new Object[]{getCharacterName(nextCharacterNumber)},
                turn.getPlayerState().getPlayer().getProfile().getLocale()
        );
        turn.setNotification(notificationMessage);
        return nextCharacterNumber;
    }

    @Transactional
    public void endTurn(UUID turnId) {
        endTurn(turnId, false);
    }

    @Transactional
    public void endTurn(UUID turnId, boolean outOfTime) {
        Turn turn = turnRepository.findById(turnId).orElseThrow(() -> new TurnNotFoundException("Turn not found"));

        if (turn.isHasDrawnBuilding() && !turn.getCompletedFases().contains(TurnFase.INCOMEFASE.name())) {
            throw new IllegalTurnStateException("Cannot end turn, buildings have been drawn but INCOMEFASE not completed (did you forget to put back a building?)");
        }

        if (turn.isCompleted()) {
            return;
        }

        PlayerState playerState = turn.getPlayerState();
        Player player = playerState.getPlayer();
        Profile profile = player.getProfile();
        String userName = profile.getUserName();

        String notificationMessage = messageSource.getMessage(
                "turn.end.notification",
                new Object[]{userName},
                turn.getPlayerState().getPlayer().getProfile().getLocale()
        );
        sendDiscordNotification(profile.getDiscord(), notificationMessage);
        turn.setNotification(notificationMessage);

        turn.setCompleted(true);
        Turn savedTurn = saveTurn(turn);
        boolean isCharacterChoicePhase = turn.getRound().getFase() == RoundFase.CHARACTERCHOICEFASE;
        if (isCharacterChoicePhase) {
            if (outOfTime) GivePlayerCharacterIfHasNone(savedTurn, playerState);
            savedTurn = saveTurn(savedTurn);
            handleCharacterChoicePhase(savedTurn);
        } else {
            addJustPlayedCharacterToPlayedCharacters(playerState);
            handleNonCharacterChoicePhase(savedTurn);
        }
    }

    @Transactional
    protected void addJustPlayedCharacterToPlayedCharacters(PlayerState playerState) {
        List<GameCharacter> characters = playerState.getCharacters();
        List<GameCharacter> charactersThatHavePlayed = playerState.getCharactersThatHavePlayed();

        GameCharacter playedCharacter = characters.stream()
                .filter(character -> !charactersThatHavePlayed.contains(character))
                .min(Comparator.comparingInt(GameCharacter::getNumber))
                .orElseThrow(() -> new CharacterNotFoundException("No character found that just played"));

        playerState.getCharactersThatHavePlayed().add(playedCharacter);
        playerStateService.save(playerState);
    }

    @Transactional
    protected void handleCharacterChoicePhase(Turn turn) {
        Game game = turn.getRound().getGame();
        List<PlayerState> playerStates = game.getPlayerStates();
        int requiredCharacters = playerStates.size() == 3 ? 2 : 1;

        boolean allCharactersChosen = playerStates.stream()
                .allMatch(ps -> ps.getCharacters().size() >= requiredCharacters);

        if (allCharactersChosen) {
            turn.getRound().setFase(RoundFase.ACTIONFASE);
            Turn savedTurn = saveTurn(turn);
            roundService.saveRound(turn.getRound());
            int nextCharacter = findNextCharacterPlayer(savedTurn);
            if (nextCharacter == -1) {
                createNewTurn(game.getId(), 1);
            } else {
                createNewTurn(game.getId(), nextCharacter);
            }
        } else {
            UUID nextPlayerStateId = findNextPlayerStateInCharacterChoicePhase(game.getId(), turn.getPlayerState().getPlayer());
            createNewTurn(game.getId(), -1, nextPlayerStateId);
        }
    }

    @Transactional
    protected void handleNonCharacterChoicePhase(Turn turn) {
        int nextCharacter = findNextCharacterPlayer(turn);
        turn = turnRepository.findById(turn.getId()).orElseThrow(() -> new TurnNotFoundException("Turn not found"));

        Game game = turn.getRound().getGame();
        List<PlayerState> playerStates = game.getPlayerStates();

        boolean isLastRound = playerStates.stream().anyMatch(PlayerState::isFirstToEightBuildings);

        if (nextCharacter == 1 || nextCharacter == -1) {
            turn.getRound().setCompleted(true);
            roundService.saveRound(turn.getRound());

            if (isLastRound) {
                game.getPlayerStates().forEach(playerState -> gameService.calculateScores(playerState.getPlayer()));
                game.getPlayerStates().forEach(playerState -> achievementService.checkAchievementConditions(playerState.getPlayer()));
                Game refetchedGame = gameService.findGameById(game.getId());
                refetchedGame.setCompleted(true);
                refetchedGame.setEndTime(LocalDateTime.now());
                refetchedGame.setWinner(game.getPlayerStates().stream().max(Comparator.comparingInt(PlayerState::getScore)).orElseThrow(() -> new PlayerStateNotFoundException("Couldn't find highest scoring playerstate!")).getPlayer());
                game.getPlayerStates().forEach(playerState -> leaderboardService.checkScoreQualifies(playerState.getPlayer().getId(), playerState.getPlayer().getProfile().getUserName(), game.getId(), game.getStartTime(), playerState.getScore(), playerState.getPlayer().getProfile().getId()));
                gameService.saveGame(refetchedGame);
            } else {
                Round newRound = prepareNewRound(game.getId());
                createNewTurn(newRound.getGame().getId(), 1, newRound.getKing().getId());
            }
        } else {
            createNewTurn(turn.getRound().getGame().getId(), nextCharacter);
        }
    }

    @Transactional
    protected void GivePlayerCharacterIfHasNone(Turn turn, PlayerState playerState) {
        Game game = gameService.findGameById(turn.getRound().getGame().getId());
        List<PlayerState> playerStates = game.getPlayerStates();
        int requiredCharacters = playerStates.size() == 3 ? 2 : 1;

        if (turn.getRound().getFase() == RoundFase.CHARACTERCHOICEFASE && playerState.getCharacters().size() < requiredCharacters) {
            List<GameCharacter> availableCharacters = turn.getRound().getCharacterDeck().getCharacters().stream()
                    .filter(character -> playerStates.stream()
                            .noneMatch(ps -> ps.getCharacters().contains(character)))
                    .toList();

            if (!availableCharacters.isEmpty()) {
                GameCharacter randomCharacter = availableCharacters.get(new Random().nextInt(availableCharacters.size()));
                playerState.getCharacters().add(randomCharacter);
                playerStateService.save(playerState);

                turn.getRound().getCharacterDeck().getCharacters().remove(randomCharacter);
                roundService.saveRound(turn.getRound());
            } else {
                throw new IllegalStateException("No available characters to assign");
            }
        }
    }

    @Transactional
    public Turn saveTurn(Turn turn) {
        return turnRepository.save(turn);
    }

    @Transactional
    @Async
    public void startTurnCountdown(UUID turnId, int turnDuration) {
        TransactionTemplate transactionTemplate = new TransactionTemplate(transactionManager);
        scheduler.schedule(() -> {
            transactionTemplate.execute(status -> {
                endTurn(turnId, true);
                return null;
            });
        }, turnDuration, TimeUnit.MINUTES);
    }

    public int getCountOfAllTurnsFromRound(UUID roundId) {
        Round round = roundService.findRoundNonDto(roundId);
        return turnRepository.countByRound(round);
    }

    public void sendDiscordNotification(String userName, String message) {
        discordService.onTurn(userName, message);
    }
}
