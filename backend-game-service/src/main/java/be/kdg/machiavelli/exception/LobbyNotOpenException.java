package be.kdg.machiavelli.exception;

public class LobbyNotOpenException extends RuntimeException {
    public LobbyNotOpenException(String message) {
        super(message);
    }
}
