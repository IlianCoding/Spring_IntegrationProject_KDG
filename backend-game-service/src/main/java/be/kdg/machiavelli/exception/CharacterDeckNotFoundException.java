package be.kdg.machiavelli.exception;

public class CharacterDeckNotFoundException extends RuntimeException {
    public CharacterDeckNotFoundException(String message) {
        super(message);
    }
}
