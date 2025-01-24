// ProfileMapper.java
package be.kdg.machiavelli.controllers.mappers;

import be.kdg.machiavelli.controllers.dto.FriendDto;
import be.kdg.machiavelli.controllers.dto.ProfileDto;
import be.kdg.machiavelli.domain.Profile;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.springframework.stereotype.Component;

import java.util.List;

@Mapper(componentModel = "spring", uses = {AchievementMapper.class, GimmickMapper.class})
@Component
public interface ProfileMapper {
    ProfileDto toDto(Profile profile);

    Profile toDomain(ProfileDto profileDto);

    List<Profile> toDomains(List<ProfileDto> profiles);


    List<ProfileDto> toDtos(List<Profile> profiles);

    @Mapping(target = "userName", source = "userName")
    @Mapping(target = "name", source = "name")
    @Mapping(target = "achievements", source = "achievements")
    @Mapping(target = "avatarUrl", source = "avatarUrl")
    @Mapping(target = "birthday", source = "birthday")
    FriendDto toFriendDto(Profile profile);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "numberOfLoyaltyPoints", ignore = true)
    @Mapping(target = "channel", ignore = true)
    @Mapping(target = "friends", ignore = true)
    @Mapping(target = "gimmicks", ignore = true)
    Profile toProfile(FriendDto friendDto);

    @Mapping(target = "userName", source = "userName")
    @Mapping(target = "name", source = "name")
    @Mapping(target = "achievements", source = "achievements")
    @Mapping(target = "avatarUrl", source = "avatarUrl")
    @Mapping(target = "birthday", source = "birthday")
    List<FriendDto> toFriendDtoList(List<Profile> profiles);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "numberOfLoyaltyPoints", ignore = true)
    @Mapping(target = "channel", ignore = true)
    @Mapping(target = "friends", ignore = true)
    @Mapping(target = "gimmicks", ignore = true)
    List<Profile> toProfileList(List<FriendDto> friendDtos);
}