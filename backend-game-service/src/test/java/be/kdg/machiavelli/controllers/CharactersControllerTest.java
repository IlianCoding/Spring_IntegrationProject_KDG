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
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;


@Import(TestcontainersConfiguration.class)
@SpringBootTest
@AutoConfigureMockMvc
class CharactersControllerTest {

    @Autowired
    private MockMvc mockMvc;


    @Test
    @WithMockUser(authorities = "player")
    void findAllCharacters() throws Exception {

        mockMvc.perform(get("/api/characters"))
                .andExpect(status().isOk())
                .andExpect(header().string(CONTENT_TYPE, MediaType.APPLICATION_JSON.toString()))
                .andExpect(jsonPath("$[0].name").value("Assassin"))
                .andExpect(jsonPath("$[1].name").value("Thief"))
                .andExpect(jsonPath("$[2].name").value("Magician"))
                .andExpect(jsonPath("$[3].name").value("King"));

    }
}