package be.kdg.machiavelli.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.NOT_FOUND)
public class PlayerStateException extends RuntimeException{
    public PlayerStateException(String message) {super(message);}
}
