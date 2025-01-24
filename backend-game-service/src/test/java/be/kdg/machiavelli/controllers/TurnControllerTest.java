package be.kdg.machiavelli.controllers;

import be.kdg.machiavelli.TestcontainersConfiguration;
import io.restassured.module.mockmvc.RestAssuredMockMvc;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.web.context.WebApplicationContext;

import java.util.UUID;

import static org.springframework.http.HttpHeaders.CONTENT_TYPE;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;

@Import(TestcontainersConfiguration.class)
@SpringBootTest()
@AutoConfigureMockMvc
class TurnControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private WebApplicationContext webApplicationContext;

    @BeforeEach
    public void setUp() {
        RestAssuredMockMvc.webAppContextSetup(webApplicationContext);
        RestAssuredMockMvc.postProcessors(csrf().asHeader());
    }

    @Test
    @WithMockUser(authorities = "player")
    void testGetTurnWithPlayerAuthority() throws Exception {
        UUID turnId = UUID.fromString("edfe5f6f-807a-4c05-9c64-802a43ab7298");

        mockMvc.perform(get("/api/turns/{turnId}", turnId).with(csrf()))
                .andExpect(status().isOk());
    }

    @Test
    @WithMockUser(authorities = "player")
    void getRemainingCoinsInBank() throws Exception {
        mockMvc.perform(get("/api/turns/{turnId}/get-remaining-coins-in-bank", "18f807c3-74e9-4754-b7d1-f00da20d0fe9").with(csrf()))
                .andExpect(status().isOk())
                .andExpect(header().string(CONTENT_TYPE, MediaType.APPLICATION_JSON.toString()))
                .andExpect(jsonPath("$").value(19))
                .andDo(print());
    }

    @Test
    @WithMockUser(authorities = "player")
    void getCompletedFases() throws Exception {
        mockMvc.perform(get("/api/turns/{turnId}/completedFases", "18f807c3-74e9-4754-b7d1-f00da20d0fe9").with(csrf()))
                .andExpect(status().isOk())
                .andExpect(header().string(CONTENT_TYPE, MediaType.APPLICATION_JSON.toString()));
    }
}