package be.kdg.machiavelli.controllers;

import be.kdg.machiavelli.TestcontainersConfiguration;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;


import static org.springframework.http.HttpHeaders.CONTENT_TYPE;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;


@Import(TestcontainersConfiguration.class)
@SpringBootTest
@AutoConfigureMockMvc
class GameControllerTest {

    @Autowired
    MockMvc mockMvc;

    @Test
    @WithMockUser(authorities = "player")
    void testGetGamesOfWeek_Success() throws Exception {
        mockMvc.perform(get("/api/game/{profileId}/get-games-of-week", "4f02f07a-bf8c-4876-8e96-d7cc2a8d4226")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(header().string(CONTENT_TYPE, MediaType.APPLICATION_JSON.toString()))
                .andExpect(jsonPath("$.length()").value(0))
                .andDo(print());
    }

    @Test
    @WithMockUser(authorities = "player")
    void testGetGamesOfWeek_NoGames() throws Exception {
        mockMvc.perform(get("/api/game/{profileId}/get-games-of-week", "4f02f07a-bf8c-4876-8e96-d7cc2a8d4226")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(header().string(CONTENT_TYPE, MediaType.APPLICATION_JSON.toString()))
                .andExpect(jsonPath("$.length()").value(0))
                .andDo(print());
    }

    @Test
    @WithMockUser(authorities = "player")
    void testGetOngoingGames_Success() throws Exception {
        mockMvc.perform(get("/api/game/{profileId}/ongoing-games", "d2d82406-65c0-4517-ba68-59d4c6c6a996"))
                .andExpect(status().isOk())
                .andExpect(header().string(CONTENT_TYPE, MediaType.APPLICATION_JSON.toString()))
                .andExpect(jsonPath("$.length()").value(3))
                .andDo(print());
    }

    @Test
    @WithMockUser(authorities = "player")
    void testGetOngoingGames_NoGamesFound() throws Exception {
        mockMvc.perform(get("/api/game/{profileId}/ongoing-games", "4f02f07a-5555-4876-8e96-d7cc2a8d4226"))
                .andExpect(status().isOk())
                .andExpect(header().string(CONTENT_TYPE, MediaType.APPLICATION_JSON.toString()))
                .andExpect(jsonPath("$.length()").value(0))
                .andDo(print());
    }

    @Test
    void testGetOngoingGames_Unauthorized() throws Exception {
        mockMvc.perform(get("/api/game/{profileId}/ongoing-games", "4f02f07a-bf8c-4876-8e96-d7cc2a8d4226"))
                .andExpect(status().isUnauthorized())
                .andDo(print());
    }

    @Test
    @WithMockUser(authorities = "player")
    void getGame() throws Exception {
        mockMvc.perform(get("/api/game/{gameId}", "d16a4438-949a-4d13-ad48-5f72dd19223b"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.turnDuration").value(10))
                .andExpect(jsonPath("$.startTime").value("2024-11-30T17:29:56"))
                .andExpect(jsonPath("$.coinsInBank").value(19))
                .andExpect(jsonPath("$.numberOfRounds").value(1))
                .andExpect(jsonPath("$.completed").value(false))
                .andDo(print());
    }
}
