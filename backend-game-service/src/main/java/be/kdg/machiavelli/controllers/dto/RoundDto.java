package be.kdg.machiavelli.controllers.dto;

import be.kdg.machiavelli.domain.enums.RoundFase;
import java.time.LocalDateTime;
import java.util.UUID;

public record RoundDto(UUID id, boolean completed, RoundFase fase, LocalDateTime createdAt, CharacterDeckDto characterDeck, GameDto game, PlayerDto king) {
}