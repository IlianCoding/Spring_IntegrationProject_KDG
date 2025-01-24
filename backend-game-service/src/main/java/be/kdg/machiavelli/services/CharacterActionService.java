package be.kdg.machiavelli.services;

import be.kdg.machiavelli.controllers.dto.PlayerStateDto;
import be.kdg.machiavelli.controllers.mappers.PlayerStateMapper;
import be.kdg.machiavelli.domain.*;
import be.kdg.machiavelli.controllers.dto.ActionDto;
import be.kdg.machiavelli.domain.enums.Color;
import be.kdg.machiavelli.exception.PlayerStateNotFoundException;
import be.kdg.machiavelli.repositories.PlayerStateRepository;
import org.springframework.context.MessageSource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class CharacterActionService {


    // Services
    private final BuildingDeckService buildingDeckService;
    private final CharacterService characterService;
    private final PlayerService playerService;
    private final GameService gameService;
    private final BuildingService buildingService;
    private final PlayerStateMapper playerStateMapper;
    private final TurnService turnService;

    // MessageSource
    private final MessageSource messageSource;


    // Repositories
    private final PlayerStateRepository playerStateRepository;

    public CharacterActionService(BuildingDeckService buildingDeckService, CharacterService characterService, PlayerService playerService, GameService gameService, BuildingService buildingService, PlayerStateMapper playerStateMapper, TurnService turnService, PlayerStateRepository playerStateRepository, MessageSource messageSource) {
        this.buildingDeckService = buildingDeckService;
        this.characterService = characterService;
        this.playerService = playerService;
        this.gameService = gameService;
        this.buildingService = buildingService;
        this.playerStateMapper = playerStateMapper;
        this.turnService = turnService;
        this.playerStateRepository = playerStateRepository;
        this.messageSource = messageSource;
    }

    @Transactional
    public PlayerStateDto actionSelector(ActionDto actionDto) {
        GameCharacter character = characterService.findCharacterById(UUID.fromString(actionDto.executiveCharacterId()));
        Player executivePlayer = playerService.findPlayerById(UUID.fromString(actionDto.executivePlayerId()));

        // Retrieve the latest turn for the player
        Turn turn = turnService.findTurnById(UUID.fromString(actionDto.turnId()));

        if (turn.getCompletedFases().contains("CHARACTERFASE") || turn.getCompletedFases().contains(character.getName())) {
            throw new IllegalStateException("Action cannot be performed as CHARACTERFASE is already completed.");
        }

        // Select correct action depending on which character the current player has assigned.
        PlayerState playerState = switch (character.getName()) {
            case "Assassin" -> assassinAction(actionDto);
            case "Thief" -> thiefAction(actionDto);
            case "Magician" -> magicianAction(actionDto);
            case "King" -> kingAction(actionDto);
            case "Bishop" -> preacherAction(actionDto);
            case "Merchant" -> merchantAction(actionDto);
            case "Architect" -> architectAction(actionDto);
            case "Warlord" -> mercenaryAction(actionDto);
            default -> playerStateRepository.findPlayerStateByPlayer(executivePlayer)
                    .orElseThrow(() -> new PlayerStateNotFoundException("The PlayerState you are trying to get cannot be found"));
        };

        if (turn.getCompletedFases() == null) {
            turn.setCompletedFases(new HashSet<>());
        }
        turn.getCompletedFases().add(character.getName());
        turnService.saveTurn(turn);

        return mapToDto(playerState);
    }

    private PlayerStateDto mapToDto(PlayerState playerState) {
        return playerStateMapper.toDto(playerState);
    }

    private PlayerState assassinAction(ActionDto actionDto) {
        GameCharacter targetCharacter = characterService.findCharacterById(UUID.fromString(actionDto.targetCharacterId()));
        String name = targetCharacter.getName();
        Game game = gameService.findGameById(UUID.fromString(actionDto.gameId()));
        Player executivePlayer = playerService.findPlayerById(UUID.fromString(actionDto.executivePlayerId()));

        // Find the player who has the designated murdered character and set isAssassinated to true.
        Player targetPlayer = game.getPlayerStates().stream()
                .filter(playerState -> playerState.getCharacters().stream()
                        .anyMatch(gameCharacter -> gameCharacter.getName().equals(name)))
                .map(PlayerState::getPlayer)
                .findFirst()
                .orElseThrow(() -> new PlayerStateNotFoundException("The PlayerState you are trying to get cannot be found"));

        Optional<PlayerState> targetPlayerState = playerStateRepository.findPlayerStateByPlayer(targetPlayer);
        Optional<PlayerState> executivePlayerState = playerStateRepository.findPlayerStateByPlayer(executivePlayer);

        return targetPlayerState.map(targetState ->
                executivePlayerState.map(execState -> {
                    String notificationMessage = messageSource.getMessage(
                            "character.action.assassin",
                            new Object[]{execState.getPlayer().getProfile().getName(), targetCharacter.getName()},
                            execState.getPlayer().getProfile().getLocale()
                    );
                    execState.setNotification(notificationMessage);
                    targetState.setAssassinated(true);
                    playerStateRepository.save(execState);
                    return playerStateRepository.save(targetState);
                }).orElseThrow(() -> new PlayerStateNotFoundException("The PlayerState you are trying to get cannot be found"))
        ).orElseThrow(() -> new PlayerStateNotFoundException("The PlayerState you are trying to get cannot be found"));
    }


    private PlayerState thiefAction(ActionDto actionDto) {
        Player targetPlayer = playerService.findPlayerById(UUID.fromString(actionDto.targetPlayerId()));
        Player executivePlayer = playerService.findPlayerById(UUID.fromString(actionDto.executivePlayerId()));

        // remove all coins from the target player and add them to the executive player's pouch.
        PlayerState executivePlayerState = playerStateRepository.findPlayerStateByPlayer(executivePlayer).orElseThrow(() -> new PlayerStateNotFoundException("The PlayerState you are trying to get cannot be found"));
        PlayerState targetPlayerState = playerStateRepository.findPlayerStateByPlayer(targetPlayer).orElseThrow(() -> new PlayerStateNotFoundException("The PlayerState you are trying to get cannot be found"));
        int stolenCoins = targetPlayerState.getNumberOfCoins();
        int startingCoinsExecutivePlayer = executivePlayerState.getNumberOfCoins();
        executivePlayerState.setNumberOfCoins(startingCoinsExecutivePlayer + stolenCoins);
        targetPlayerState.setNumberOfCoins(0);

        String notificationMessage = messageSource.getMessage(
                "character.action.thief",
                new Object[]{executivePlayerState.getPlayer().getProfile().getName(), targetPlayer.getProfile().getUserName(), stolenCoins},
                executivePlayerState.getPlayer().getProfile().getLocale()
        );
        executivePlayerState.setNotification(notificationMessage);

        playerStateRepository.save(targetPlayerState);
        return playerStateRepository.save(executivePlayerState);


    }

    private PlayerState magicianAction(ActionDto actionDto) {
        Player executivePlayer = playerService.findPlayerById(UUID.fromString(actionDto.executivePlayerId()));
        Player targetPlayer;

        if (actionDto.targetPlayerId() == null || actionDto.targetPlayerId().isEmpty()) {
            targetPlayer = executivePlayer;
        } else {
            targetPlayer = playerService.findPlayerById(UUID.fromString(actionDto.targetPlayerId()));
        }

        Game game = gameService.findGameById(UUID.fromString(actionDto.gameId()));

        BuildingDeck buildingDeck = game.getBuildingDeck();
        PlayerState executivePlayerState = playerStateRepository.findPlayerStateByPlayer(executivePlayer)
                .orElseThrow(() -> new PlayerStateNotFoundException("The PlayerState you are trying to get cannot be found"));
        PlayerState targetPlayerState = playerStateRepository.findPlayerStateByPlayer(targetPlayer)
                .orElseThrow(() -> new PlayerStateNotFoundException("The PlayerState you are trying to get cannot be found"));

        if (actionDto.choice()) {
            List<Building> buildingsToSteal = targetPlayerState.getBuildingsInHand();
            List<Building> buildingsToExchange = executivePlayerState.getBuildingsInHand();
            targetPlayerState.setBuildingsInHand(buildingsToExchange);
            executivePlayerState.setBuildingsInHand(buildingsToSteal);
            String notificationMessage = messageSource.getMessage(
                    "character.action.magician.trade",
                    new Object[]{executivePlayerState.getPlayer().getProfile().getName(), targetPlayer.getProfile().getUserName()},
                    executivePlayerState.getPlayer().getProfile().getLocale()
            );
            executivePlayerState.setNotification(notificationMessage);
        } else {
            List<Building> buildingsDrawn = buildingDeckService.drawBuildings(actionDto.buildingIdsToExchange().size(), buildingDeck);
            List<UUID> buildingIdsToExchange = actionDto.buildingIdsToExchange().stream()
                    .map(UUID::fromString)
                    .collect(Collectors.toList());
            List<Building> buildingsToExchange = buildingService.findBuildingsByIds(buildingIdsToExchange);
            List<Building> buildingsOfPlayer = executivePlayerState.getBuildingsInHand();
            buildingsOfPlayer.removeAll(buildingsToExchange);
            buildingsOfPlayer.addAll(buildingsDrawn);
            String notificationMessage = messageSource.getMessage(
                    "character.action.magician.bank",
                    new Object[]{executivePlayerState.getPlayer().getProfile().getName(), actionDto.buildingIdsToExchange().size()},
                    executivePlayerState.getPlayer().getProfile().getLocale()
            );
            executivePlayerState.setNotification(notificationMessage);
        }

        playerStateRepository.save(targetPlayerState);
        return playerStateRepository.save(executivePlayerState);
    }

    private PlayerState kingAction(ActionDto actionDto) {
        Player executivePlayer = playerService.findPlayerById(UUID.fromString(actionDto.executivePlayerId()));
        Optional<PlayerState> optionalExecutivePlayerState = playerStateRepository.findPlayerStateByPlayer(executivePlayer);

        return optionalExecutivePlayerState.map(executivePlayerState -> {
            // 1 coin for every built yellow building
            int coins = addCoinsForCharacterBuildings(Color.YELLOW, executivePlayer);
            String notificationMessage = messageSource.getMessage(
                    "character.action.king",
                    new Object[]{executivePlayerState.getPlayer().getProfile().getName(), coins},
                    executivePlayerState.getPlayer().getProfile().getLocale()
            );
            executivePlayerState.setNotification(notificationMessage);
            return playerStateRepository.save(executivePlayerState);
        }).orElseThrow(() -> new PlayerStateNotFoundException("The PlayerState you are trying to get cannot be found"));
    }

    private PlayerState preacherAction(ActionDto actionDto) {
        Player executivePlayer = playerService.findPlayerById(UUID.fromString(actionDto.executivePlayerId()));
        Optional<PlayerState> optionalExecutivePlayerState = playerStateRepository.findPlayerStateByPlayer(executivePlayer);

        return optionalExecutivePlayerState.map(executivePlayerState -> {
            // 1 coin for every built blue building
            int coins = addCoinsForCharacterBuildings(Color.BLUE, executivePlayer);
            String notificationMessage = messageSource.getMessage(
                    "character.action.bishop",
                    new Object[]{executivePlayerState.getPlayer().getProfile().getName(), coins},
                    executivePlayerState.getPlayer().getProfile().getLocale()
            );
            executivePlayerState.setNotification(notificationMessage);
            return playerStateRepository.save(executivePlayerState);
        }).orElseThrow(() -> new PlayerStateNotFoundException("The PlayerState you are trying to get cannot be found"));
    }

    private PlayerState merchantAction(ActionDto actionDto) {
        Player executivePlayer = playerService.findPlayerById(UUID.fromString(actionDto.executivePlayerId()));
        Optional<PlayerState> optionalExecutivePlayerState = playerStateRepository.findPlayerStateByPlayer(executivePlayer);

        return optionalExecutivePlayerState.map(executivePlayerState -> {
            // 1 extra coin
            executivePlayerState.setNumberOfCoins(executivePlayerState.getNumberOfCoins() + 1);

            // 1 coin for every built green building
            int coins = addCoinsForCharacterBuildings(Color.GREEN, executivePlayer);

            String notificationMessage = messageSource.getMessage(
                    "character.action.merchant",
                    new Object[]{executivePlayerState.getPlayer().getProfile().getName(), coins},
                    executivePlayerState.getPlayer().getProfile().getLocale()
            );
            executivePlayerState.setNotification(notificationMessage);

            return playerStateRepository.save(executivePlayerState);
        }).orElseThrow(() -> new PlayerStateNotFoundException("The PlayerState you are trying to get cannot be found"));
    }

    private PlayerState architectAction(ActionDto actionDto) {
        Player executivePlayer = playerService.findPlayerById(UUID.fromString(actionDto.executivePlayerId()));
        Optional<PlayerState> optionalExecutivePlayerState = playerStateRepository.findPlayerStateByPlayer(executivePlayer);

        return optionalExecutivePlayerState.map(executivePlayerState -> {
            String notificationMessage = messageSource.getMessage(
                    "character.action.architect",
                    new Object[]{executivePlayerState.getPlayer().getProfile().getName()},
                    executivePlayerState.getPlayer().getProfile().getLocale()
            );
            executivePlayerState.setNotification(notificationMessage);
            return playerStateRepository.save(executivePlayerState);
        }).orElseThrow(() -> new PlayerStateNotFoundException("The PlayerState you are trying to get cannot be found"));
    }

    private PlayerState mercenaryAction(ActionDto actionDto) {
        Player executivePlayer = playerService.findPlayerById(UUID.fromString(actionDto.executivePlayerId()));
        Player targetPlayer = playerService.findPlayerById(UUID.fromString(actionDto.targetPlayerId()));
        PlayerState executivePlayerState = playerStateRepository.findPlayerStateByPlayer(executivePlayer)
                .orElseThrow(() -> new PlayerStateNotFoundException("The PlayerState you are trying to get cannot be found"));
        PlayerState targetPlayerState = playerStateRepository.findPlayerStateByPlayer(targetPlayer)
                .orElseThrow(() -> new PlayerStateNotFoundException("The PlayerState you are trying to get cannot be found"));

        // 1 coin for every built red building
        int coins = addCoinsForCharacterBuildings(Color.RED, executivePlayer);

        // Check that the targeted building card costs at most 1 less than the amount of gold in the mercenary's inventory
        Building targetBuilding = buildingService.findBuildingById(UUID.fromString(actionDto.targetBuildingId()));
        int cost = targetBuilding.getCost() - 1;
        if (executivePlayerState.getNumberOfCoins() < cost) {
            throw new IllegalStateException("Not enough coins to perform the mercenary action");
        }

        // TODO: check that the target player does not have 8 or more buildings, should be checked in turnService(?) before the character action is called.
        List<Building> buildingsOfTarget = targetPlayerState.getBuildingsBuilt();
        if (targetPlayerState.getCharacters().stream().noneMatch(character -> character.getName().equalsIgnoreCase("Bishop"))) {
            // Remove the building from the target player's built buildings.
            buildingsOfTarget.remove(targetBuilding);
            // Reduce the executive player's coins by the cost of the destroyed building minus 1.
            executivePlayerState.setNumberOfCoins(executivePlayerState.getNumberOfCoins() - cost);
            playerStateRepository.save(targetPlayerState);
            String notificationMessage = messageSource.getMessage(
                    "character.action.warlord",
                    new Object[]{
                            executivePlayerState.getPlayer().getProfile().getName(),
                            targetPlayer.getProfile().getUserName(),
                            targetBuilding.getName(),
                            cost,
                            coins
                    },
                    executivePlayerState.getPlayer().getProfile().getLocale()
            );
            executivePlayerState.setNotification(notificationMessage);
        }

        return playerStateRepository.save(executivePlayerState);
    }

    private int addCoinsForCharacterBuildings(Color color, Player player) {
        PlayerState playerState = playerStateRepository.findPlayerStateByPlayer(player)
                .orElseThrow(() -> new PlayerStateNotFoundException("The PlayerState you are trying to get cannot be found"));

        int totalCoinsGained = 0;
        List<Building> buildingsOfPlayer = playerState.getBuildingsBuilt();
        for (Building building : buildingsOfPlayer) {
            if (building.getColor().equals(color)) {
                playerState.setNumberOfCoins(playerState.getNumberOfCoins() + 1);
                totalCoinsGained++;
            }
        }
        playerStateRepository.save(playerState);
        return totalCoinsGained;
    }

    @Transactional
    public boolean canPerformMercenaryAction(UUID executivePlayerId, UUID targetBuildingId) {
        PlayerState executivePlayerState = playerStateRepository.findPlayerStateByPlayerId(executivePlayerId)
                .orElseThrow(() -> new PlayerStateNotFoundException("The PlayerState you are trying to get cannot be found"));
        Building targetBuilding = buildingService.findBuildingById(targetBuildingId);
        int cost = targetBuilding.getCost() - 1;
        return executivePlayerState.getNumberOfCoins() >= cost;
    }
}