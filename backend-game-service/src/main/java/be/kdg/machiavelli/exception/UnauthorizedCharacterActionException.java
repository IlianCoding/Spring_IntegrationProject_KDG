package be.kdg.machiavelli.exception;

public class UnauthorizedCharacterActionException extends RuntimeException {
    public UnauthorizedCharacterActionException(String message) {
        super(message);
    }
}
