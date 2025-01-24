package be.kdg.machiavelli.services;

import be.kdg.machiavelli.config.properties.ConfigProperties;
import be.kdg.machiavelli.controllers.dto.GameDto;
import be.kdg.machiavelli.controllers.dto.LobbyDto;
import be.kdg.machiavelli.controllers.mappers.GameMapper;
import be.kdg.machiavelli.controllers.mappers.LobbyMapper;
import be.kdg.machiavelli.domain.*;
import be.kdg.machiavelli.exception.*;
import be.kdg.machiavelli.repositories.*;
import be.kdg.machiavelli.domain.Lobby;
import be.kdg.machiavelli.domain.Profile;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class LobbyService {
    private final LobbyRepository lobbyRepository;
    private final ProfileRepository profileRepository;
    private final GameRepository gameRepository;
    private final ProfileService profileService;
    private final ConfigProperties configProperties;
    private final LobbyMapper lobbyMapper;
    private final PlayerStateRepository playerStateRepository;
    private final PlayerRepository playerRepository;
    private final GameMapper gameMapper;

    public LobbyService(LobbyRepository lobbyRepository, ProfileRepository profileRepository, GameRepository gameRepository, ProfileService profileService, ConfigProperties configProperties, LobbyMapper lobbyMapper, PlayerStateRepository playerStateRepository, PlayerRepository playerRepository, GameMapper gameMapper) {
        this.lobbyRepository = lobbyRepository;
        this.profileRepository = profileRepository;
        this.gameRepository = gameRepository;
        this.profileService = profileService;
        this.configProperties = configProperties;
        this.lobbyMapper = lobbyMapper;
        this.playerStateRepository = playerStateRepository;
        this.playerRepository = playerRepository;
        this.gameMapper = gameMapper;
    }

    @Transactional
    public Lobby findById(UUID lobbyId) {
        return lobbyRepository.findById(lobbyId).orElseThrow(() -> new LobbyNotFoundException("Lobby not found"));
    }

    @Transactional
    public LobbyDto findDtoById(UUID lobbyId) {
        return lobbyMapper.toDto(lobbyRepository.findById(lobbyId).orElseThrow(() -> new LobbyNotFoundException("Lobby not found")));
    }

    @Transactional
    public Profile findOldestProfile(UUID lobbyId){
        Optional<Lobby> lobby = lobbyRepository.findById(lobbyId);

        return lobby.flatMap(value -> value.getProfiles().stream().min(Comparator.comparing(Profile::getBirthday))).orElseThrow(() -> new ProfileNotFoundException("Profile not found"));
    }

    @Transactional
    public LobbyDto create(UUID profileId) {
        Lobby lobby = new Lobby();
        profileRepository.findById(profileId).ifPresent(profile -> lobby.setProfiles(List.of(profile)));
        Game game = new Game();
        game.setLobby(lobby);
        lobby.setOpen(true);
        lobby.setOwnerId(profileId);
        lobbyRepository.save(lobby);
        gameRepository.save(game);
        return lobbyMapper.toDto(lobby);
    }

    @Transactional
    public LobbyDto addPlayer(UUID lobbyId, UUID profileId) {
        Lobby lobby = lobbyRepository.findById(lobbyId).orElseThrow(() -> new LobbyNotFoundException("Lobby not found"));
        Profile profile = profileRepository.findById(profileId).orElseThrow(() -> new ProfileNotFoundException("Profile not found"));
        if (!lobby.isOpen()) {
            throw new LobbyNotOpenException("Lobby not open");
        }
        lobby.getProfiles().add(profile);
        lobby = setAverageLoyaltyPoints(lobby);
        return lobbyMapper.toDto(lobbyRepository.save(lobby));
    }

    @Transactional
    public LobbyDto startLobbyGame(UUID lobbyId) {
        Lobby lobby = lobbyRepository.findById(lobbyId).orElseThrow(() -> new LobbyNotFoundException("Lobby not found"));
        List<PlayerState> playerStates = new ArrayList<>();

        Game game = gameRepository.findTopByLobbyOrderByStartTimeDesc(lobby);
        if (game == null) {
            throw new GameNotFoundException("No game found for the lobby");
        }

        List<Profile> profiles = lobby.getProfiles();
        for (Profile profile : profiles) {
            Player player = new Player();
            player.setProfile(profile);
            playerRepository.save(player);

            PlayerState playerState = new PlayerState();
            playerState.setPlayer(player);
            playerState.setCharacters(new ArrayList<>());
            playerState.setCharactersThatHavePlayed(new ArrayList<>());
            playerState.setBuildingsBuilt(new ArrayList<>());
            playerState.setBuildingsInHand(new ArrayList<>());
            playerStates.add(playerState);
        }

        playerStateRepository.saveAll(playerStates);
        game.setPlayerStates(playerStates);
        lobby.setOpen(false);

        return lobbyMapper.toDto(lobbyRepository.save(lobby));
    }

    @Transactional
    public LobbyDto joinLobbyAutomatically(UUID profileId) {
        Profile profile = profileService.findById(profileId);
        int loyaltyPoints = profile.getNumberOfLoyaltyPoints();

        List<Lobby> lobbies = lobbyRepository.findByOpenTrue();
        lobbies = lobbies.stream().filter(lobby -> lobby.getProfiles().size() <= 6).toList();

        for(Lobby lobby : lobbies){
            if (loyaltyPoints <= lobby.getAverageLoyaltyPoints() + configProperties.getLobbyDifferential() && loyaltyPoints >= lobby.getAverageLoyaltyPoints() - configProperties.getLobbyDifferential() && !lobby.getProfiles().stream().map(Profile::getId).toList().contains(profile.getId()) && lobby.getProfiles().size() < 7) {
                return addPlayer(lobby.getId(), profileId);
            } else {
                throw new NoLobbyWithinLevelFound("Unable to find lobby within skill level");
            }
        }
        return null;
    }

    private Lobby setAverageLoyaltyPoints(Lobby lobby) {
        List<Profile> profiles = lobby.getProfiles();
        int loyaltyPoints = 0;
        for(Profile profile : profiles) {
            loyaltyPoints += profile.getNumberOfLoyaltyPoints();
        }
        loyaltyPoints /= profiles.size();
        lobby.setAverageLoyaltyPoints(loyaltyPoints);
        return lobbyRepository.save(lobby);
    }

    @Transactional
    public List<LobbyDto> findAllOpenLobbies() {
         return lobbyMapper.toDtos(lobbyRepository.findLobbiesByOpen(true));
    }

    @Transactional
    public List<LobbyDto> findAllLobbies() {
        return lobbyMapper.toDtos(lobbyRepository.findAll());
    }

    @Transactional
    public void setTurnDuration(UUID lobbyId, int duration) {
        Lobby lobby = lobbyRepository.findById(lobbyId)
                .orElseThrow(() -> new LobbyNotFoundException("Lobby not found"));
        if (lobby.isOpen()) {
            Game game = gameRepository.findTopByLobbyOrderByStartTimeDesc(lobby);
            if (game == null) {
                throw new GameNotFoundException("No game found for the lobby");
            }
            game.setTurnDuration(duration);
            gameRepository.save(game);
        } else {
            throw new LobbyNotOpenException("Lobby not open");
        }
    }

    private LobbyDto remakeLobby(UUID lobbyId) {
        Lobby lobby = lobbyRepository.findById(lobbyId).orElseThrow(() -> new LobbyNotFoundException("Lobby not found"));
        List<Profile> profiles = lobby.getProfiles();
        lobby.setProfiles(profiles);
        Game game = new Game();
        game.setLobby(lobby);
        lobby.setOpen(true);
        gameRepository.save(game);
        return lobbyMapper.toDto(lobbyRepository.save(lobby));
    }


    private LobbyDto endLobby(UUID lobbyId) {
        Lobby lobby = lobbyRepository.findById(lobbyId).orElseThrow(() -> new LobbyNotFoundException("Lobby not found"));
        lobby.setProfiles(new ArrayList<>());
        return lobbyMapper.toDto(lobbyRepository.save(lobby));
    }


    @Transactional
    public LobbyDto selectChoiceAfterGame(Boolean choice, UUID lobbyId) {

        if (choice) {
            return remakeLobby(lobbyId);
        } else {
            return endLobby(lobbyId);
        }
    }

    @Transactional
    public List<GameDto> findGamesByLobbyId(UUID lobbyId) {
        List<Game> games = gameRepository.findByLobby_Id(lobbyId);
        return games.stream().map(gameMapper::toDto).collect(Collectors.toList());
    }
}
