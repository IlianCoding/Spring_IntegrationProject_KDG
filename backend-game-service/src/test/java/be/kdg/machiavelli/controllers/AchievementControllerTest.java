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
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;


@Import(TestcontainersConfiguration.class)
@SpringBootTest
@AutoConfigureMockMvc
class AchievementControllerTest {

    @Autowired
    private MockMvc mockMvc;


    @Test
    @WithMockUser(authorities = "player")
    void getAllAchievements() throws Exception {

        mockMvc.perform(get("/api/achievements"))
                .andExpect(status().isOk())
                .andExpect(header().string(CONTENT_TYPE, MediaType.APPLICATION_JSON.toString()))
                .andExpect(jsonPath("$[0].name").value("Pro"))
                .andExpect(jsonPath("$[0].numberOfLoyaltyPoints").value(20))
                .andExpect(jsonPath("$[1].name").value("Expert"))
                .andExpect(jsonPath("$[1].numberOfLoyaltyPoints").value(50))
                .andExpect(jsonPath("$[2].name").value("Speedrunner"))
                .andExpect(jsonPath("$[2].numberOfLoyaltyPoints").value(30))
                .andExpect(jsonPath("$[3].name").value("High roller"))
                .andExpect(jsonPath("$[3].numberOfLoyaltyPoints").value(50))
                .andExpect(jsonPath("$[4].name").value("Addict"))
                .andExpect(jsonPath("$[4].numberOfLoyaltyPoints").value(50))
                .andExpect(jsonPath("$[5].name").value("Master architect"))
                .andExpect(jsonPath("$[5].numberOfLoyaltyPoints").value(150))
                .andExpect(jsonPath("$[6].name").value("Hoarder"))
                .andExpect(jsonPath("$[6].numberOfLoyaltyPoints").value(30))
                .andExpect(jsonPath("$[7].name").value("Beginner architect"))
                .andExpect(jsonPath("$[7].numberOfLoyaltyPoints").value(20))
                .andDo(print());
    }

    @Test
    void getAllAchievementsOfUnauthorizedProfile() throws Exception {

        mockMvc.perform(get("/api/achievements"))
                .andExpect(status().isUnauthorized());

    }
}