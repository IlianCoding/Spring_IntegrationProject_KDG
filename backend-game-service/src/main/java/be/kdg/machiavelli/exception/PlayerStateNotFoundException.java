package be.kdg.machiavelli.exception;

public class PlayerStateNotFoundException extends RuntimeException {
    public PlayerStateNotFoundException(String message) {
        super(message);
    }
}
