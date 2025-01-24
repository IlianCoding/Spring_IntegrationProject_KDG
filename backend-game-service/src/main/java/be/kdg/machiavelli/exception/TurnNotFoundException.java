package be.kdg.machiavelli.exception;

public class TurnNotFoundException extends RuntimeException {
    public TurnNotFoundException(String message) {
        super(message);
    }
}