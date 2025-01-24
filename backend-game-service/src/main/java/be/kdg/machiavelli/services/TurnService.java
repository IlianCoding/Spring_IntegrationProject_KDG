package be.kdg.machiavelli.services;

import be.kdg.machiavelli.controllers.dto.BuildingDto;
import be.kdg.machiavelli.controllers.dto.ProfileDto;
import be.kdg.machiavelli.controllers.dto.TurnDto;
import be.kdg.machiavelli.controllers.mappers.BuildingMapper;
import be.kdg.machiavelli.controllers.mappers.TurnMapper;
import be.kdg.machiavelli.domain.*;
import be.kdg.machiavelli.domain.enums.TurnFase;
import be.kdg.machiavelli.exception.IllegalTurnStateException;
import be.kdg.machiavelli.exception.NotEnoughResourcesException;
import be.kdg.machiavelli.exception.TurnNotFoundException;
import be.kdg.machiavelli.repositories.TurnRepository;
import org.springframework.context.MessageSource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.*;

import be.kdg.machiavelli.exception.UnauthorizedCharacterActionException;

@Service
@Transactional
public class TurnService {

    private final TurnRepository turnRepository;
    private final BuildingDeckService buildingDeckService;
    private final TurnMapper turnMapper;
    private final BuildingMapper buildingMapper;
    private final MessageSource messageSource;

    public TurnService(TurnRepository turnRepository, BuildingDeckService buildingDeckService, TurnMapper turnMapper, BuildingMapper buildingMapper, MessageSource messageSource) {
        this.turnRepository = turnRepository;
        this.buildingDeckService = buildingDeckService;
        this.turnMapper = turnMapper;
        this.buildingMapper = buildingMapper;
        this.messageSource = messageSource;
    }

    public TurnDto takeCoins(UUID turnId, int numberOfCoins, boolean isCharacterAbility) {
        Turn turn = turnRepository.findById(turnId).orElseThrow(() -> new TurnNotFoundException("Turn not found"));

        // Check if the action is authorized to bypass the lock
        if (isCharacterAbility && isNotAuthorizedForCharacterAbility(turnId)) {
            throw new UnauthorizedCharacterActionException("Unauthorized action: Cannot take coins as a character ability");
        }

        if (!isCharacterAbility && turn.getCompletedFases().contains(TurnFase.INCOMEFASE.name())) {
            throw new IllegalTurnStateException("Cannot take coins, INCOMEFASE already completed");
        }

        if (turn.getRound().getGame().getCoinsInBank() < numberOfCoins) {
            throw new NotEnoughResourcesException("Not enough coins in the bank!");
        }

        turn = updatePlayerCoins(turn, numberOfCoins);

        if (!isCharacterAbility) {
            turn.getCompletedFases().add(TurnFase.INCOMEFASE.name());
        }

        return turnMapper.toDto(saveTurn(turn));
    }

    public TurnDto getCompletedFases(UUID turnId) {
        Turn turn = turnRepository.findById(turnId).orElseThrow(() -> new TurnNotFoundException("Turn not found"));
        return turnMapper.toDto(turn);
    }

    public int getRemainingCoinsInBank(UUID turnId) {
        Turn turn = turnRepository.findById(turnId).orElseThrow(() -> new TurnNotFoundException("Turn not found"));
        return turn.getRound().getGame().getCoinsInBank();
    }

    public int getRemainingCardsInBuildingDeck(UUID turnId) {
        Turn turn = turnRepository.findById(turnId).orElseThrow(() -> new TurnNotFoundException("Turn not found"));
        return turn.getRound().getGame().getBuildingDeck().getBuildings().size();
    }

    public List<BuildingDto> drawBuildings(UUID turnId, int amount, boolean isCharacterAbility) {
        Turn turn = turnRepository.findById(turnId).orElseThrow(() -> new TurnNotFoundException("Turn not found"));

        // Check if the action is authorized to bypass the lock
        if (isCharacterAbility && isNotAuthorizedForCharacterAbility(turnId)) {
            throw new UnauthorizedCharacterActionException("Unauthorized action: Cannot draw buildings as a character ability");
        }

        if (!isCharacterAbility && turn.getCompletedFases().contains(TurnFase.INCOMEFASE.name())) {
            throw new IllegalTurnStateException("Cannot draw buildings, INCOMEFASE already completed");
        }

        BuildingDeck buildingDeck = turn.getRound().getGame().getBuildingDeck();

        if (!isCharacterAbility && turn.isHasDrawnBuilding()) {
            throw new IllegalTurnStateException("Cannot draw buildings twice in one turn");
        }

        if (buildingDeck.getBuildings().size() < amount) {
            throw new NotEnoughResourcesException("Not enough buildings in the deck!");
        }

        if (!isCharacterAbility) {
            turn.setHasDrawnBuilding(true);
        }

        if (!isCharacterAbility && turn.getPlayerState().getCharacters().stream().anyMatch(character -> character.getNumber() == 7)) {
            turn.getCompletedFases().add(TurnFase.INCOMEFASE.name());
        }

        // check if player is magician and is using ability to replace whole hand with new buildings
        if (isCharacterAbility) {
            if (turn.getPlayerState().getCharacters().stream().anyMatch(character -> character.getNumber() == 3)) {
                List<Building> buildingsInHand = new ArrayList<>(turn.getPlayerState().getBuildingsInHand());
                for (Building building : buildingsInHand) {
                    putBackBuilding(turnId, buildingMapper.toDto(building));
                }
            }
        }

        List<Building> buildings = buildingDeckService.drawBuildings(amount, buildingDeck);
        turn.getPlayerState().getBuildingsInHand().addAll(buildings);

        String notificationMessage = messageSource.getMessage(
                "player.drawn.buildings",
                new Object[]{turn.getPlayerState().getPlayer().getProfile().getUserName(), 2},
                turn.getPlayerState().getPlayer().getProfile().getLocale()
        );
        turn.setNotification(notificationMessage);

        saveTurn(turn);
        return buildings.stream().map(buildingMapper::toDto).toList();
    }

    public boolean isNotAuthorizedForCharacterAbility(UUID turnId) {
        Turn turn = turnRepository.findById(turnId).orElseThrow(() -> new TurnNotFoundException("Turn not found"));
        PlayerState playerState = turn.getPlayerState();
        List<String> characterNames = playerState.getCharacters().stream()
                .map(GameCharacter::getName)
                .toList();

        long completedCharacterActions = turn.getCompletedFases().stream()
                .filter(characterNames::contains)
                .count();

        return completedCharacterActions >= characterNames.size();
    }


    public TurnDto putBackBuilding(UUID turnId, BuildingDto buildingToPutBack) {
        return putBackBuilding(turnId, buildingToPutBack, false);
    }

    // overload for magician ability
    public TurnDto putBackBuilding(UUID turnId, BuildingDto buildingToPutBack, boolean isCharacterAbility) {
        Turn turn = turnRepository.findById(turnId).orElseThrow(() -> new TurnNotFoundException("Turn not found"));

        if (turn.getCompletedFases().contains(TurnFase.INCOMEFASE.name())) {
            throw new IllegalTurnStateException("Cannot put back buildings, INCOMEFASE already completed");
        }

        PlayerState playerState = turn.getPlayerState();
        boolean isBuilder = playerState.getCharacters().stream().anyMatch(character -> character.getNumber() == 7);

        if (isBuilder && !isCharacterAbility) {
            return turnMapper.toDto(saveTurn(turn));
        }

        BuildingDeck buildingDeck = turn.getRound().getGame().getBuildingDeck();
        turn.getPlayerState().getBuildingsInHand().remove(buildingMapper.toDomain(buildingToPutBack));

        buildingDeckService.putBackBuilding(buildingMapper.toDomain(buildingToPutBack), buildingDeck);
        turn.getCompletedFases().add(TurnFase.INCOMEFASE.name());

        return turnMapper.toDto(saveTurn(turn));
    }

    public TurnDto buildBuilding(UUID turnId, UUID buildingId) {
        Turn turn = turnRepository.findById(turnId).orElseThrow(() -> new TurnNotFoundException("Turn not found"));

        if (turn.getCompletedFases().contains(TurnFase.BUILDFASE.name())) {
            throw new IllegalTurnStateException("Cannot build buildings, BUILDFASE already completed");
        }

        PlayerState playerState = turn.getPlayerState();
        Building buildingToBuild = getBuildingToBuild(playerState, buildingId);

        if (playerState.getNumberOfCoins() < buildingToBuild.getCost()) {
            throw new NotEnoughResourcesException("Not enough coins to build this building");
        }

        int maxBuildings = playerState.getCharacters().stream().anyMatch(character -> character.getNumber() == 7) ? 3 : 1;
        if (turn.getAmountOfBuildingsBuiltThisTurn() >= maxBuildings) {
            throw new IllegalTurnStateException("Cannot build more than " + maxBuildings + " buildings in one turn");
        }

        playerState.getBuildingsBuilt().add(buildingToBuild);
        playerState.getBuildingsInHand().remove(buildingToBuild);
        turn.setAmountOfBuildingsBuiltThisTurn(turn.getAmountOfBuildingsBuiltThisTurn() + 1);

        if (turn.getAmountOfBuildingsBuiltThisTurn() == maxBuildings) {
            turn.getCompletedFases().add(TurnFase.BUILDFASE.name());
        }

        // Check if the player has 8 or more buildings
        if (playerState.getBuildingsBuilt().size() >= 8) {
            playerState.setHasEightOrMoreBuildings(true);

            // Check if any other player in the same round already has 8 or more buildings
            boolean anyOtherPlayerHasEightOrMoreBuildings = turn.getRound().getGame().getPlayerStates().stream().anyMatch(ps -> ps.isHasEightOrMoreBuildings() && !ps.equals(playerState));

            if (!anyOtherPlayerHasEightOrMoreBuildings) {
                playerState.setFirstToEightBuildings(true);
            }
        }

        turn = updatePlayerCoins(turn, -buildingToBuild.getCost());
        updateBankCoins(turn, buildingToBuild.getCost());

        String notificationMessage = messageSource.getMessage(
                "player.build.building",
                new Object[]{turn.getPlayerState().getPlayer().getProfile().getUserName(), buildingToBuild.getName(), buildingToBuild.getCost()},
                turn.getPlayerState().getPlayer().getProfile().getLocale()
        );

        turn.setNotification(notificationMessage);

        return turnMapper.toDto(saveTurn(turn));
    }

    public Turn saveTurn(Turn turn) {
        return turnRepository.save(turn);
    }

    Building getBuildingToBuild(PlayerState playerState, UUID buildingId) {
        return playerState.getBuildingsInHand().stream().filter(building -> building.getId().equals(buildingId)).findFirst().orElseThrow(() -> new TurnNotFoundException("Building not found in player's hand"));
    }

    private Turn updatePlayerCoins(Turn turn, int amount) {
        PlayerState playerState = turn.getPlayerState();
        playerState.setNumberOfCoins(turn.getPlayerState().getNumberOfCoins() + amount);
        if (amount > 0) {
            String notificationMessage = messageSource.getMessage(
                    "player.taken.coins",
                    new Object[]{playerState.getPlayer().getProfile().getUserName(), amount},
                    playerState.getPlayer().getProfile().getLocale()
            );
            playerState.setNotification(notificationMessage);
        }
        return updateBankCoins(turn, -amount);
    }

    private Turn updateBankCoins(Turn turn, int amount) {
        turn.getRound().getGame().setCoinsInBank(turn.getRound().getGame().getCoinsInBank() + amount);
        return turn;
    }

    public TurnDto getTurn(UUID turnId) {
        Turn turn = turnRepository.findById(turnId).orElseThrow(() -> new TurnNotFoundException("Turn not found"));
        return turnMapper.toDto(turn);
    }

    public Turn findLatestTurnOrNull(UUID gameId) {
        return turnRepository.findTopByRound_Game_IdOrderByCreatedAtDesc(gameId).orElse(null);
    }

    public Turn findTurnById(UUID id) {
        return turnRepository.findById(id).orElseThrow(() -> new TurnNotFoundException("Turn not found"));
    }

    public TurnDto findLatestTurn(UUID gameId) {
        Turn latestTurn = turnRepository.findTopByRound_Game_IdOrderByCreatedAtDesc(gameId).orElseThrow(() -> new TurnNotFoundException("Turn not found"));
        return turnMapper.toDto(latestTurn);
    }

    public TurnDto getLatestTurnByGameAndProfile(UUID gameId, UUID profileId) {
        return turnMapper.toDto(turnRepository.findTopByRound_Game_IdAndPlayerState_Player_Profile_IdOrderByCreatedAtDesc(gameId, profileId).orElseThrow(() -> new TurnNotFoundException("Turn not found")));
    }

    public boolean isPlayersTurn(UUID gameId, UUID profileId) {
        TurnDto latestTurn = findLatestTurn(gameId);
        ProfileDto profile = latestTurn.playerState().player().profile();
        System.out.println("Profile id: " + profile.id());
        System.out.println("Compared to: " + profileId);
        return profile.id().equals(profileId);
    }

    public long getRemainingTime(UUID turnId) {
        Turn turn = turnRepository.findById(turnId).orElseThrow(() -> new TurnNotFoundException("Turn not found"));
        LocalDateTime endTime = turn.getCreatedAt().plusMinutes(turn.getRound().getGame().getTurnDuration());
        long remainingTime = Duration.between(LocalDateTime.now(), endTime).toSeconds();
        return remainingTime < 0 ? 0 : remainingTime;
    }
}