package be.kdg.machiavelli.controllers;

import be.kdg.machiavelli.controllers.dto.CharacterDto;
import be.kdg.machiavelli.controllers.mappers.CharacterMapper;
import be.kdg.machiavelli.domain.GameCharacter;
import be.kdg.machiavelli.services.CharacterService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;


@RestController
@RequestMapping("/api/characters")
public class CharactersController {

    private final CharacterService service;
    private final CharacterMapper characterMapper;

    public CharactersController(CharacterService service, CharacterMapper characterMapper) {
        this.service = service;
        this.characterMapper = characterMapper;
    }

    @GetMapping
    @PreAuthorize("hasAuthority('player')")

    public ResponseEntity<List<CharacterDto>> findAllCharacters() {
        List<GameCharacter> characters = service.findAllCharacters();
        if (characters == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(characters.stream().map(characterMapper::toDto).toList());
    }
}
