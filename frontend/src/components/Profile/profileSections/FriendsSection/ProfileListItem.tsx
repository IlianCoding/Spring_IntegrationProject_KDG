import {Avatar, IconButton, ListItem, ListItemAvatar, ListItemText, Tooltip} from '@mui/material';
import PersonAddAltSharpIcon from '@mui/icons-material/PersonAddAltSharp';
import PersonRemoveSharpIcon from '@mui/icons-material/PersonRemoveSharp';
import PersonSearchSharpIcon from '@mui/icons-material/PersonSearchSharp';
import {Friend} from "../../../../model/profile/Friend.ts";
import {useTranslation} from 'react-i18next';

interface ProfileListItemProps {
    friend: Friend;
    friendsSet: Set<string>;
    handleProfileClick: (userName: string) => void;
    handleRemoveFriendClick: (userName: string) => void;
    handleAddFriendClick: (userName: string) => void;
}

function ProfileListItem({
                             friend,
                             friendsSet,
                             handleProfileClick,
                             handleRemoveFriendClick,
                             handleAddFriendClick
                         }: ProfileListItemProps) {
    const {t} = useTranslation();
    return (
        <ListItem
            secondaryAction={
                <>
                    <Tooltip title={t("View Profile")}>
                        <IconButton onClick={() => handleProfileClick(friend.name)}>
                            <PersonSearchSharpIcon/>
                        </IconButton>
                    </Tooltip>
                    {friendsSet.has(friend.userName) ? (
                        <Tooltip title={t("Remove Friend")}>
                            <IconButton aria-label={t("Remove Friend")}
                                        onClick={() => handleRemoveFriendClick(friend.name)}>
                                <PersonRemoveSharpIcon/>
                            </IconButton>
                        </Tooltip>
                    ) : (
                        <Tooltip title={t("Add Friend")}>
                            <IconButton aria-label={t("Add Friend")} onClick={() => handleAddFriendClick(friend.name)}>
                                <PersonAddAltSharpIcon/>
                            </IconButton>
                        </Tooltip>
                    )}
                </>
            }
            sx={{
                border: '2px solid #FFD700',
                borderRadius: '10px',
                boxShadow: '0 0 10px rgba(0, 0, 0, 0.5)',
                transition: 'transform 0.3s, box-shadow 0.3s',
                '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 0 20px rgba(0, 0, 0, 0.7)'
                },
                mb: 2
            }}
        >
            <ListItemAvatar>
                <Avatar src={friend.avatarUrl}/>
            </ListItemAvatar>
            <ListItemText
                primary={friend.name}
                secondary={friend.userName}
                primaryTypographyProps={{style: {color: 'black'}}}
                sx={{pr: 6}}
            />
        </ListItem>
    );
}

export default ProfileListItem;