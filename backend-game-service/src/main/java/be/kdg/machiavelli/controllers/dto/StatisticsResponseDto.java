package be.kdg.machiavelli.controllers.dto;

public record StatisticsResponseDto(float prediction_average_rating, float prediction_owned_users, float prediction_complexity_average) {
}
