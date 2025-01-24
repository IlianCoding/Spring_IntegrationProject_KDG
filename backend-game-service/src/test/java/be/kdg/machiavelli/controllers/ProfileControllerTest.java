package be.kdg.machiavelli.controllers;

import be.kdg.machiavelli.TestcontainersConfiguration;
import be.kdg.machiavelli.domain.Profile;
import be.kdg.machiavelli.repositories.ProfileRepository;
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

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.springframework.http.HttpHeaders.CONTENT_TYPE;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@Import(TestcontainersConfiguration.class)
@SpringBootTest
@AutoConfigureMockMvc
class ProfileControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ProfileRepository profileRepository;

    @Autowired
    private WebApplicationContext webApplicationContext;

    @BeforeEach
    public void setUp() {
        RestAssuredMockMvc.webAppContextSetup(webApplicationContext);
        RestAssuredMockMvc.postProcessors(csrf().asHeader());
    }

    @Test
    @WithMockUser(authorities = "player")
    void getProfile() throws Exception {
        mockMvc.perform(get("/api/profiles/{id}", "d2d82406-65c0-4517-ba68-59d4c6c6a996"))
                .andExpect(status().isOk())
                .andExpect(header().string(CONTENT_TYPE, MediaType.APPLICATION_JSON.toString()))
                .andExpect(jsonPath("$.id").value("d2d82406-65c0-4517-ba68-59d4c6c6a996"))
                .andExpect(jsonPath("$.userName").value("DrDiabetes"));
    }

    @Test
    @WithMockUser(authorities = "player")
    void setAvatarUrl() throws Exception {
        mockMvc.perform(put("/api/profiles/{id}/avatar", "d2d82406-65c0-4517-ba68-59d4c6c6a996").with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                  {
                                  "avatarUrl": "/assets/profile/avatars/jeonghan.jpg"
                                  }
                                  """))
                .andExpect(status().isOk());
    }

    @Test
    @WithMockUser(authorities = "player")
    void updateProfile() throws Exception {
        mockMvc.perform(put("/api/profiles").with(csrf())
        .contentType(MediaType.APPLICATION_JSON)
                .content("""
                          {
                          "id": "d2d82406-65c0-4517-ba68-59d4c6c6a996",
                          "userName": "DrDiabetes",
                          "name": "test test",
                          "numberOfLoyaltyPoints": 250,
                          "birthday": "1998-02-01",
                          "avatarUrl": "/assets/profile/avatars/jeonghan.jpg",
                          "channel": "DISCORD"
                          }
                          """))
                .andExpect(status().isOk());
    }
}