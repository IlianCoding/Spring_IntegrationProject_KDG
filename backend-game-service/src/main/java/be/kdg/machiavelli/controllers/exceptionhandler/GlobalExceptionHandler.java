package be.kdg.machiavelli.controllers.exceptionhandler;

import be.kdg.machiavelli.exception.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler({BuildingNotFoundException.class, TurnNotFoundException.class, GameNotFoundException.class, RoundNotFoundException.class, NoKingFoundException.class, ProfileNotFoundException.class, GimmickNotFoundException.class, LobbyNotFoundException.class, InvitationNotFoundException.class, NoLobbyWithinLevelFound.class})
    public ResponseEntity<String> handleNotFoundException(Exception ex) {
        return new ResponseEntity<>(ex.getMessage(), HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler({UnauthorizedCharacterActionException.class, NotEnoughResourcesException.class, IllegalTurnStateException.class, GimmickNotOwnedException.class, GimmickAlreadyOwnedException.class, LobbyNotOpenException.class})
    public ResponseEntity<String> handleIllegalTurnStateException(IllegalTurnStateException ex) {
        return new ResponseEntity<>(ex.getMessage(), HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(TournamentException.class)
    public ResponseEntity<String> handleTournamentException(TournamentException ex) {
        return new ResponseEntity<>(ex.getMessage(), HttpStatus.BAD_REQUEST);
    }
}