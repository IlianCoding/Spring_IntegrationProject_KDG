package be.kdg.machiavelli.services;

import be.kdg.machiavelli.domain.Profile;
import be.kdg.machiavelli.exception.ProfileNotFoundException;
import be.kdg.machiavelli.repositories.ProfileRepository;
import org.springframework.stereotype.Service;

import java.util.Locale;
import java.util.UUID;

@Service
public class LanguageService {

    private final ProfileRepository profileRepository;

    public LanguageService(ProfileRepository profileRepository) {
        this.profileRepository = profileRepository;
    }

    public void updateLocale(UUID userId, String localeStr) {
        Profile profile = profileRepository.findById(userId).orElseThrow(() -> new ProfileNotFoundException("Profile not found"));
        String language = "en";
        String country = "UK";
        if ("be".equalsIgnoreCase(localeStr)) {
            language = "nl";
            country = "BE";
        } else if ("en".equalsIgnoreCase(localeStr)) {
            language = "en";
            country = "UK";
        }
        profile.setLocale(new Locale.Builder()
                .setLanguage(language)
                .setRegion(country)
                .build());
        profileRepository.save(profile);
    }
}