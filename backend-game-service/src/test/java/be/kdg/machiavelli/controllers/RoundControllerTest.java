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
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;

@Import(TestcontainersConfiguration.class)
@SpringBootTest
@AutoConfigureMockMvc
class RoundControllerTest {

    @Autowired
    private MockMvc mockMvc;


    @Test
    @WithMockUser(authorities = "player")
    void getRound() throws Exception {
        mockMvc.perform(get("/api/rounds/{roundId}", "850fd19b-15ef-4003-a3a9-b1059753de2f"))
                .andExpect(status().isOk())
                .andExpect(header().string(CONTENT_TYPE, MediaType.APPLICATION_JSON.toString()))
                .andExpect(jsonPath("$.id").value("850fd19b-15ef-4003-a3a9-b1059753de2f"))
                .andExpect(jsonPath("$.completed").value(false))
                .andExpect(jsonPath("$.fase").value("ACTIONFASE"))
                .andDo(print());

    }

    @Test
    @WithMockUser(authorities = "player")
    void findLastRound() throws Exception {
        mockMvc.perform(get("/api/rounds/last/{gameId}", "d16a4438-949a-4d13-ad48-5f72dd19223b"))
                .andExpect(status().isOk())
                .andExpect(header().string(CONTENT_TYPE, MediaType.APPLICATION_JSON.toString()))
                .andExpect(jsonPath("$.id").value("850fd19b-15ef-4003-a3a9-b1059753de2f"))
                .andExpect(jsonPath("$.completed").value(false))
                .andExpect(jsonPath("$.fase").value("ACTIONFASE"))
                .andDo(print());
    }

    @Test
    @WithMockUser(authorities = "player")
    void findCharacterDeckOfRound() throws Exception {
        mockMvc.perform(get("/api/rounds/{roundId}/characterdeck", "850fd19b-15ef-4003-a3a9-b1059753de2f"))
                .andExpect(status().isOk())
                .andExpect(header().string(CONTENT_TYPE, MediaType.APPLICATION_JSON.toString()))
                .andExpect(jsonPath("$.id").value("b262d2f3-7a52-46e3-af5a-9713e73770e0"))
                .andExpect(jsonPath("$.characters[0].id").value("667f90a9-93ae-4539-a75a-655be71ae893"))
                .andExpect(jsonPath("$.characters[0].name").value("Assassin"))
                .andExpect(jsonPath("$.characters[1].id").value("4d29d9a3-93a8-4548-a464-eef0a29b4233"))
                .andExpect(jsonPath("$.characters[1].name").value("Thief"))
                .andDo(print());
    }
}