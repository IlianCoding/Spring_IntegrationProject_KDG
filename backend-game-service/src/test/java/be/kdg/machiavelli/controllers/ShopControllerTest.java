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
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@Import(TestcontainersConfiguration.class)
@SpringBootTest
@AutoConfigureMockMvc
class ShopControllerTest {


    @Autowired
    private MockMvc mockMvc;

    @Test
    @WithMockUser(authorities = "player")
    void getGimmicks() throws Exception {
        mockMvc.perform(get("/api/shop/gimmicks"))
                .andExpect(status().isOk())
                .andExpect(header().string(CONTENT_TYPE, MediaType.APPLICATION_JSON.toString()));
    }
}