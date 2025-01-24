package be.kdg.machiavelli.controllers.dto;

import java.time.LocalDateTime;
import java.util.UUID;

public record GameEventDto(
        String type,
        LocalDateTime beginTimeStamp,
        UUID gameId,
        LocalDateTime endTimeStamp
) {
}
