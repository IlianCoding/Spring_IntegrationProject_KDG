package be.kdg.machiavelli.exception;

public class NotEnoughResourcesException extends RuntimeException {
    public NotEnoughResourcesException(String message) {
        super(message);
    }
}