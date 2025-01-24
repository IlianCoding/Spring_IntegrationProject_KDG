package be.kdg.machiavelli.services;

import be.kdg.machiavelli.controllers.dto.GameDto;
import be.kdg.machiavelli.controllers.mappers.GameMapper;
import be.kdg.machiavelli.domain.*;
import be.kdg.machiavelli.domain.enums.Color;
import be.kdg.machiavelli.exception.GameNotFoundException;
import be.kdg.machiavelli.repositories.GameRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class GameService {

    public final GameRepository repository;
    public final LobbyService lobbyService;
    public final PlayerStateService playerStateService;
    private final BuildingDeckService buildingDeckService;
    private final GameMapper gameMapper;
    private final GameRepository gameRepository;
    private final PlayerService playerService;

    public GameService(GameRepository repository, LobbyService lobbyService, PlayerStateService playerStateService, BuildingDeckService buildingDeckService, GameMapper gameMapper, GameRepository gameRepository, PlayerService playerService) {
        this.repository = repository;
        this.lobbyService = lobbyService;
        this.playerStateService = playerStateService;
        this.buildingDeckService = buildingDeckService;
        this.gameMapper = gameMapper;
        this.gameRepository = gameRepository;
        this.playerService = playerService;
    }

    @Transactional
    public Game findGameById(UUID id) {
        return repository.findById(id).orElseThrow(() -> new GameNotFoundException("The game you are trying to find does not exist"));
    }

    @Transactional
    public void updateNumberOfRoundsOfGame(UUID gameId) {
        Game game = repository.findById(gameId).orElseThrow(() -> new GameNotFoundException("The game you are trying to find does not exist"));
        game.setNumberOfRounds(game.getNumberOfRounds() + 1);
        repository.save(game);
    }

    @Transactional
    public Player findOldestPlayer(UUID gameId) {
        Game game = repository.findById(gameId).orElseThrow(() -> new GameNotFoundException("The game you are trying to find does not exist"));
        Lobby lobby = game.getLobby();
        Profile profile = lobbyService.findOldestProfile(lobby.getId());
        for (PlayerState playerState : game.getPlayerStates()) {
            if (playerState.getPlayer().getProfile() == profile) {
                return playerState.getPlayer();
            }
        }
        return null;
    }
    @Transactional
    public Player findKing(UUID gameId) {
        Optional<Game> game = repository.findById(gameId);
        if (game.isPresent()) {
            for (PlayerState playerState : game.get().getPlayerStates()) {
                for (GameCharacter character : playerState.getCharacters()) {
                    if (character.getNumber() == 4) {
                        return playerState.getPlayer();
                    }
                }
            }
            return null;
        }
        return null;
    }

    @Transactional
    public GameDto findByIdDto(UUID gameId) {
        return gameMapper.toDto(repository.findById(gameId).orElseThrow(() -> new GameNotFoundException("Game not found")));
    }

    private List<Building> drawStartingBuildingsFromBuildingDeck(Game game) {
        return buildingDeckService.takeNumberOfBuildingsFromBuildingDeck(4, game.getBuildingDeck());
    }

    public int findAmountOfPlayers(UUID gameId) {
        Optional<Game> game = repository.findById(gameId);
        return game.map(g -> g.getPlayerStates().size()).orElseThrow(() -> new GameNotFoundException("The game you are trying to find does not exist"));
    }

    @Transactional
    public void resetPlayerStatesOfGame(UUID gameId) {
        Game game = repository.findById(gameId).orElseThrow(() -> new GameNotFoundException("The game you are trying to find does not exist"));
        List<PlayerState> playerStates = game.getPlayerStates();
        for (PlayerState state : playerStates) {
            playerStateService.resetPlayerState(state);
        }
    }

    @Transactional
    public void calculateScores(Player player) {
        PlayerState playerState = playerStateService.findPlayerStateByPlayer(player.getId());

        List<Building> buildingsBuilt = playerState.getBuildingsBuilt();

        int score = 0;

        // Total of each built building's cost
        for (Building building : buildingsBuilt) {
            score += building.getCost();
        }

        // Extra points if player has one of each color built
        Set<Color> allColors = EnumSet.allOf(Color.class);
        Set<Color> buildingColors = buildingsBuilt.stream()
                .map(Building::getColor)
                .collect(Collectors.toSet());
        if (buildingColors.containsAll(allColors)) {
            score += 3;
        }

        // Extra points if player was the first to have 8 or more buildings.
        if (playerState.isFirstToEightBuildings()) {
            score += 4;
        }

        // Extra points if player has 8 or more buildings but was not the first.
        if (playerState.isHasEightOrMoreBuildings()) {
            score += 2;
        }


        playerState.setScore(score);
        playerStateService.save(playerState);
    }

    public Game findTopByLobbyOrderByStartTimeDesc(Lobby lobby) {
        return gameRepository.findTopByLobbyOrderByStartTimeDesc(lobby);
    }
    @Transactional
    public GameDto findLatestGameOfLobby(Lobby lobby) {
        return gameMapper.toDto(gameRepository.findTopByLobbyOrderByStartTimeDesc(lobby));
    }

    @Transactional
    public Game initializePlayerStates(Game game) {
        List<PlayerState> updatedPlayerStates = new ArrayList<>();

        for (PlayerState playerState : game.getPlayerStates()) {
            List<Building> drawnBuildings = drawStartingBuildingsFromBuildingDeck(game);
            playerState.setBuildingsInHand(drawnBuildings);

            playerState.setNumberOfCoins(2);
            game.setCoinsInBank(game.getCoinsInBank() - 2);

            updatedPlayerStates.add(playerState);
        }

        game.setPlayerStates(updatedPlayerStates);
        return gameRepository.save(game);
    }

    public Game saveGame(Game game) {
        return repository.save(game);
    }


    @Transactional
    public List<GameDto> gamesOfWeek(UUID profileId) {
        List<Player> players = playerService.findPlayerByProfileId(profileId);
        List<UUID> playerIds = players.stream().map(Player::getId).toList();

        List<PlayerState> playerStates = playerStateService.findPlayerStatesByPlayersIds(playerIds);

        return gameMapper.toDtos(gameRepository.findDistinctByPlayerStatesIn(playerStates).stream()
                .filter(game -> game.getEndTime() != null && game.getEndTime().isAfter(LocalDateTime.now().minusDays(7)) && game.isCompleted())
                .toList());
    }


    @Transactional
    public List<Game> getOngoingGames(UUID profileId) {
        List<Player> players = playerService.findPlayerByProfileId(profileId);
        List<UUID> playerIds = players.stream().map(Player::getId).toList();

        List<PlayerState> playerStates = playerStateService.findPlayerStatesByPlayersIds(playerIds);

        return gameRepository.findDistinctByPlayerStatesIn(playerStates).stream()
                .filter(game -> !game.isCompleted())
                .toList();
    }

}
