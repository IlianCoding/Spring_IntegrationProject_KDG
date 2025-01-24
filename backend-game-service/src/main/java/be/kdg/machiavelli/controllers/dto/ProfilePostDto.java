package be.kdg.machiavelli.controllers.dto;

import be.kdg.machiavelli.domain.enums.Channel;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

public record ProfilePostDto(UUID id, String userName, String name, int numberOfLoyaltyPoints, LocalDate birthday, String avatarUrl, Channel channel, List<FriendDto> friends, List<AchievementDto> achievements, List<GimmickDto> gimmicks, String email) {
}