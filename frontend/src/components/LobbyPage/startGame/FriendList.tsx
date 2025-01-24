import {useGetProfile} from "../../../hooks/useProfile.ts";
import React, {useContext, useState} from "react";
import {Box, Card, CardContent, CircularProgress, InputAdornment, TextField, Typography} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import securityContext from "../../../contexts/SecurityContext.ts";
import {FriendCard} from "./FriendCard.tsx";
import {useAddPlayer} from "../../../hooks/useLobbyActions.ts";
import lobbyContext from "../../../contexts/lobby/LobbyContext.ts";
import {Profile} from "../../../model/profile/Profile.ts";
import {Channel} from "../../../model/enum/Channel.ts";
import {useTranslation} from "react-i18next";

interface FriendListProps {
    isOwner: boolean;
}

export function FriendList({isOwner}: FriendListProps) {
    const {t} = useTranslation();
    const {lobby} = useContext(lobbyContext);
    const [searchTerm, setSearchTermState] = useState('');
    const {mutate: addPlayer} = useAddPlayer();
    const {userId} = useContext(securityContext);
    const profileId = userId || '';
    const {data: profile, isLoading, isError} = useGetProfile(profileId);

    const sortedProfiles = [...(lobby?.profiles ?? [])].sort((a, b) => a.name.localeCompare(b.name));

    const players = sortedProfiles;
    const filteredFriends = sortedProfiles.filter(friend =>
        friend.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        friend.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        friend.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleProfileClick = (lobbyId: string, profileId: string) => {
        addPlayer({lobbyId, profileId});
        setSearchTermState("");
    };

    const displayedProfiles: Profile[] = (searchTerm
        ? profile?.friends?.map(friend => ({
            id: friend.id!,
            userName: friend.userName,
            name: friend.name,
            subText: '',
            numberOfLoyaltyPoints: 0,
            birthday: friend.birthday,
            avatarUrl: friend.avatarUrl,
            channel: {} as Channel,
            friends: [],
            achievements: friend.achievements,
            gimmicks: [],
            activeGimmicks: [],
            email: friend.email
        })).filter(profile =>
            (profile.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                profile.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                profile.email.toLowerCase().includes(searchTerm.toLowerCase()))
        ).slice(0, 10)
        : filteredFriends) ?? [];

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const term = e.target.value;
        setSearchTermState(term);
    };

    if (isLoading) {
        return <CircularProgress/>;
    }

    if (isError || !displayedProfiles || !players || !profile || !lobby) {
        return <Typography>{t("Error loading profiles")}</Typography>;
    }

    return (
        <Card sx={{
            flexGrow: 1,
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: 'transparent',
            boxShadow: 'none'

        }}>
            <CardContent sx={{flexGrow: 1, display: 'flex', flexDirection: 'column', padding: 0}}>
                {isOwner && (
                    <>
                        <Typography variant="h5" mb={2} color="textSecondary">{t("Invite your friends")}</Typography>
                        <TextField
                            fullWidth
                            variant="outlined"
                            value={searchTerm}
                            placeholder={players.length < 7 ? t("Search for friends...") : t("Max players reached")}
                            disabled={players.length >= 7}
                            onChange={handleSearchChange}
                            slotProps={{
                                input: {
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <SearchIcon/>
                                        </InputAdornment>
                                    ),
                                    style: {color: 'black'}
                                }
                            }}
                        />
                    </>
                )}
                <Box sx={{
                    flexGrow: 1,
                    overflowY: 'auto',
                    mt: 2,
                    maxHeight: {
                        xs: '480px',
                        '@media (min-width:1176px)': {
                            maxHeight: '780px'
                        }
                    },
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center'
                }}>
                    {displayedProfiles.length > 0 ? (
                        displayedProfiles.map((profile, index) => (
                            <FriendCard
                                key={index}
                                profile={profile}
                                handleProfileClick={handleProfileClick}
                                players={players}
                            />
                        ))
                    ) : (
                        <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                            <Typography color="textSecondary">{t("No profiles found")}</Typography>
                        </Box>
                    )}
                </Box>
            </CardContent>
        </Card>
    );
}