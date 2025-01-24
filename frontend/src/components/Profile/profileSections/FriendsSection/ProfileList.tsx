import {Box, List, Typography} from '@mui/material';
import ProfileListItem from './ProfileListItem.tsx';
import {Friend} from "../../../../model/profile/Friend.ts";
import {useTranslation} from 'react-i18next';

interface ProfileListProps {
    profiles: Friend[] | undefined;
    friendsSet: Set<string>;
    handleProfileClick: (userName: string) => void;
    handleRemoveFriendClick: (userName: string) => void;
    handleAddFriendClick: (userName: string) => void;
}

function ProfileList({
                         profiles,
                         friendsSet,
                         handleProfileClick,
                         handleRemoveFriendClick,
                         handleAddFriendClick
                     }: ProfileListProps) {
    const {t} = useTranslation();
    return (
        <List>
            {profiles?.length ? (
                profiles.map((profile) => (
                    <ProfileListItem
                        key={profile.userName}
                        friend={profile}
                        friendsSet={friendsSet}
                        handleProfileClick={handleProfileClick}
                        handleRemoveFriendClick={handleRemoveFriendClick}
                        handleAddFriendClick={handleAddFriendClick}
                    />
                ))
            ) : (
                <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                    <Typography color="textSecondary">{t("No profiles found")}</Typography>
                </Box>
            )}
        </List>
    );
}

export default ProfileList;