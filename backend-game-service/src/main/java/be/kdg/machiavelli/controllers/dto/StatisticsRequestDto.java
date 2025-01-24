package be.kdg.machiavelli.controllers.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotEmpty;

import java.util.List;

public record StatisticsRequestDto(
        @Min(0) int min_age,
        @Min(0) int users_rated,
        @Min(0) int play_time,
        @NotEmpty List<String> domains,
        @NotEmpty List<String> mechanics) {
}
