package be.kdg.machiavelli.services;

import be.kdg.machiavelli.TestcontainersConfiguration;
import be.kdg.machiavelli.controllers.dto.ActionDto;
import be.kdg.machiavelli.controllers.dto.PlayerStateDto;
import be.kdg.machiavelli.domain.*;
import be.kdg.machiavelli.repositories.PlayerStateRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.BeforeEach;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.Mockito.when;


@Import(TestcontainersConfiguration.class)
@SpringBootTest
class CharacterActionServiceTest {

    @MockBean
    private CharacterService characterService;
    @MockBean
    private PlayerService playerService;
    @MockBean
    private GameService gameService;
    @MockBean
    private TurnService turnService;
    @MockBean
    private PlayerStateRepository playerStateRepository;

    @Autowired private CharacterActionService characterActionService;

    private ActionDto actionDto;
    private Player executivePlayer;
    private Player targetPlayer;
    private Turn turn;
    private PlayerState exectuivePlayerState;
    private PlayerState targetPlayerState;
    private GameCharacter targetCharacter;
    private GameCharacter executiveCharacter;
    private Game game;

    @BeforeEach
    void setUp() {
        targetCharacter = new GameCharacter();
        targetCharacter.setName("Thief");
        targetCharacter.setId(UUID.randomUUID());

        executiveCharacter = new GameCharacter();
        executiveCharacter.setName("Assassin");
        executiveCharacter.setId(UUID.randomUUID());

        executivePlayer = new Player();
        targetPlayer = new Player();

        Profile profileExecutive = new Profile();
        profileExecutive.setName("Executive");
        executivePlayer.setProfile(profileExecutive);

        Profile profileTarget = new Profile();
        profileTarget.setName("Target");
        targetPlayer.setProfile(profileTarget);

        targetPlayerState = new PlayerState();
        targetPlayerState.setPlayer(targetPlayer);
        targetPlayerState.setCharacters(List.of(targetCharacter));

        exectuivePlayerState = new PlayerState();
        exectuivePlayerState.setPlayer(executivePlayer);
        exectuivePlayerState.setCharacters(List.of(executiveCharacter));

        turn = new Turn();
        turn.setCompletedFases(new HashSet<>());

        game = new Game();
        game.setId(UUID.randomUUID());
        game.setPlayerStates(List.of(exectuivePlayerState, targetPlayerState));

        actionDto = new ActionDto(
                executiveCharacter.getId().toString(),
                targetCharacter.getId().toString(),
                UUID.randomUUID().toString(),
                UUID.randomUUID().toString(),
                false,
                List.of("Manor", "Castle"),
                game.getId().toString(),
                UUID.randomUUID().toString(),
                UUID.randomUUID().toString()
        );
    }
}