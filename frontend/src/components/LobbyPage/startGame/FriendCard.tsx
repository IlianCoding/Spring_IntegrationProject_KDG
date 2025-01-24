import {Profile} from "../../../model/profile/Profile.ts";
import {Avatar, IconButton, ListItem, ListItemAvatar, ListItemText, Tooltip} from "@mui/material";
import PersonAddAltSharpIcon from "@mui/icons-material/PersonAddAltSharp";
import {useContext} from "react";
import lobbyContext from "../../../contexts/lobby/LobbyContext.ts";
import {CheckCircle} from "@mui/icons-material";
import {useTranslation} from "react-i18next";
import SecurityContext from "../../../contexts/SecurityContext.ts";

interface FriendCardProps {
    handleProfileClick: (lobbyId: string, profileId: string) => void;
    players: Profile[];
    profile: Profile;
}

export function FriendCard({profile, players, handleProfileClick}: FriendCardProps) {
    const {lobbyId} = useContext(lobbyContext);
    const {t} = useTranslation();
    const {userId} = useContext(SecurityContext);
    const isPlayerInLobby = players.map(player => player.name).includes(profile.name);

    return (
        <ListItem
            secondaryAction={
                isPlayerInLobby ? (
                    <Tooltip
                        title={t(profile.id === userId ? "You are already in the lobby" : "Player is already in the lobby")}>
                        <IconButton>
                            <CheckCircle/>
                        </IconButton>
                    </Tooltip>
                ) : (
                    <Tooltip title={t("Add player")}>
                        <IconButton onClick={() => handleProfileClick(lobbyId ?? "", profile.id ?? "")}>
                            <PersonAddAltSharpIcon/>
                        </IconButton>
                    </Tooltip>
                )
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
                marginY: 1,
                boxSizing: 'border-box',
                width: 'calc(100% - 16px)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            <ListItemAvatar>
                <Avatar src={profile.avatarUrl}/>
            </ListItemAvatar>
            <ListItemText
                primary={profile.userName}
                secondary={profile.name}
                primaryTypographyProps={{style: {color: 'black'}}}
                sx={{pr: 6}}
            />
        </ListItem>
    );
}