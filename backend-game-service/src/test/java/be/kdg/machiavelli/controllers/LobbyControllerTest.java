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

import static org.springframework.http.HttpHeaders.CONTENT_TYPE;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;


@Import(TestcontainersConfiguration.class)
@SpringBootTest
@AutoConfigureMockMvc
class LobbyControllerTest {

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
    void testMakeChoiceAfterGame_Success() throws Exception {

        mockMvc.perform(get("/api/lobbies/{lobbyId}/ended-game-choice", "233e194c-f5da-4f7c-92b7-4b44f3641598")
                .param("gameChoice", "true")
                .contentType(MediaType.APPLICATION_JSON));
    }

    @Test
    @WithMockUser(authorities = "player")
    void setTurnDuration() throws Exception {
        mockMvc.perform(put("/api/lobbies/{lobbyId}/set-duration", "89b80749-a4a0-478a-b658-edfd8b5ecd84")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                "duration": 5
                                }
                                """))
                 .andDo(print());
    }

    @Test
    @WithMockUser(authorities = "player")
    void findAllOpenLobbies() throws Exception {
        mockMvc.perform(get("/api/lobbies/open"))
                .andExpect(status().isOk());
    }

    @Test
    @WithMockUser(authorities = "player")
    void findAllLobbies() throws Exception {
        mockMvc.perform(get("/api/lobbies/all"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value("89b80749-a4a0-478a-b658-edfd8b5ecd84"))
                .andExpect(jsonPath("$[0].open").value(false))
                .andExpect(jsonPath("$[0].number").value(1))
                .andExpect(jsonPath("$[1].id").value("08a0bb94-8425-4f61-b9aa-6bd3adb3912a"))
                .andExpect(jsonPath("$[1].open").value(false))
                .andExpect(jsonPath("$[1].number").value(2))
                .andDo(print());
    }
}