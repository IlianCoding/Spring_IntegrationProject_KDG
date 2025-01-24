package be.kdg.machiavelli.controllers.dto;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

public record FriendDto(UUID id, String userName, String name, String avatarUrl, LocalDate birthday, List<AchievementDto> achievements, String email) {
}