package be.kdg.machiavelli.services;

import be.kdg.machiavelli.controllers.dto.OngoingGamesDto;
import be.kdg.machiavelli.domain.*;
import be.kdg.machiavelli.exception.GameNotFoundException;
import be.kdg.machiavelli.repositories.GameRepository;
import be.kdg.machiavelli.controllers.mappers.PlayerMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class OngoingGameService {
    private final RoundService roundService;
    private final TurnService turnService;
    private final LobbyService lobbyService;
    private final PlayerMapper playerMapper;
    private final GameRepository gameRepository;

    public OngoingGameService(RoundService roundService, TurnService turnService, LobbyService lobbyService, PlayerMapper playerMapper, GameRepository gameRepository) {
        this.roundService = roundService;
        this.turnService = turnService;
        this.lobbyService = lobbyService;
        this.playerMapper = playerMapper;
        this.gameRepository = gameRepository;
    }

    @Transactional
    public List<OngoingGamesDto> getOngoingGamesWithCurrentPlayerGames(List<Game> games) {
        List<OngoingGamesDto> ongoingGamesDto = findAllOngoingGames(games);
        List<OngoingGamesDto> gamesWithCurrentPlayer = new ArrayList<>();
        for (OngoingGamesDto ongoingGame : ongoingGamesDto) {
            Round round = roundService.findLastRound(ongoingGame.gameId());
            Turn turn = turnService.findLatestTurnOrNull(round.getGame().getId());
            Lobby lobby = lobbyService.findById(ongoingGame.lobbyId());
            if (lobby.isOpen() || (round.getGame().getNumberOfRounds() > 0 && !round.getGame().isCompleted())) {
                if (turn != null) {
                    gamesWithCurrentPlayer.add(new OngoingGamesDto(ongoingGame.gameId(), lobby.getId(), ongoingGame.players(), playerMapper.toDto(turn.getPlayerState().getPlayer()),  (int) turnService.getRemainingTime(turn.getId())));
                } else {
                    gamesWithCurrentPlayer.add(new OngoingGamesDto(ongoingGame.gameId(), lobby.getId(), ongoingGame.players(), null, 0));
                }
            }
        }
        return gamesWithCurrentPlayer;
    }

    @Transactional
    public List<OngoingGamesDto> findAllOngoingGames(List<Game> games) {
        List<OngoingGamesDto> ongoingGames = new ArrayList<>();
        List<Lobby> lobbies = extractLobbiesFromGames(games);
        for (Lobby lobby : lobbies) {
            Game game = gameRepository.findTopByLobbyOrderByStartTimeDesc(lobby);
            if (game == null) {
                throw new GameNotFoundException("No game found for the lobby");
            }
            List<Player> playersOfGame = extractPlayersFromGame(game);
            if (lobby.isOpen() || (game.getNumberOfRounds() > 0 && !game.isCompleted())) {
                ongoingGames.add(new OngoingGamesDto(game.getId(), lobby.getId(), playerMapper.toDtos(playersOfGame), null, 0));
            }
        }
        return ongoingGames;
    }

    private List<Lobby> extractLobbiesFromGames(List<Game> games) {
        return games.stream()
                .map(Game::getLobby)
                .collect(Collectors.toList());
    }

    private List<Player> extractPlayersFromGame(Game game) {
        return game.getPlayerStates().stream()
                .map(PlayerState::getPlayer)
                .collect(Collectors.toList());
    }
}