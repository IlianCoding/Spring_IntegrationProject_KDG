package be.kdg.machiavelli.exception;

public class GimmickAlreadyOwnedException extends RuntimeException {
    public GimmickAlreadyOwnedException(String message) {
        super(message);
    }
}
