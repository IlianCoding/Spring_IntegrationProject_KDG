package be.kdg.machiavelli.exception;

public class GimmickNotOwnedException extends RuntimeException {
    public GimmickNotOwnedException(String message) {
        super(message);
    }
}
