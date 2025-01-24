package be.kdg.machiavelli.exception;

public class IllegalTurnStateException extends RuntimeException {
    public IllegalTurnStateException(String message) {
        super(message);
    }
}