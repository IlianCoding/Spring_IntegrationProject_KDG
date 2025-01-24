import React, {useEffect, useState} from 'react';
import {Box, Card, CardContent, InputAdornment, TextField, Typography} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import {Friend} from '../../../../model/profile/Friend.ts';
import {useAddFriend, useGetAllProfiles, useRemoveFriend} from '../../../../hooks/useProfile.ts';
import {Profile} from "../../../../model/profile/Profile.ts";
import ProfileList from './ProfileList.tsx';
import {useNavigate} from 'react-router-dom';
import {useTranslation} from 'react-i18next';

interface FriendsSectionProps {
    filteredFriends: Friend[];
    setSearchTerm: (term: string) => void;
    currentUser: Profile;
}

function FriendsSection({filteredFriends, setSearchTerm, currentUser}: FriendsSectionProps) {
    const {t} = useTranslation();
    const navigate = useNavigate();
    const {data: allProfiles, isLoading, isError} = useGetAllProfiles();
    const [friendsSet, setFriendsSet] = useState<Set<string>>(new Set());
    const [searchTerm, setSearchTermState] = useState('');
    const {mutate: addFriend} = useAddFriend();
    const {mutate: removeFriend} = useRemoveFriend();

    useEffect(() => {
        if (allProfiles) {
            const friendsUsernames = new Set(filteredFriends.map(friend => friend.userName));
            setFriendsSet(friendsUsernames);
        }
    }, [allProfiles, filteredFriends]);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const term = e.target.value;
        setSearchTermState(term);
        setSearchTerm(term);
    };

    const handleProfileClick = (name: string) => {
        const friend = filteredFriends.find(friend => friend.name === name);
        if (friend) {
            navigate(`/friend/${friend.name}/${friend.userName}`);
        } else {
            console.error('Friend not found');
        }
    };

    const handleRemoveFriendClick = (name: string) => {
        const friend = allProfiles?.find(profile => profile.name === name);
        const friendId = friend?.id;
        if (friendId) {
            removeFriend({profileId: currentUser.id, friendId}, {
                onSuccess: () => {
                    setFriendsSet(prev => {
                        const newSet = new Set(prev);
                        newSet.delete(friend.userName);
                        return newSet;
                    });
                }
            });
        } else {
            console.error('Friend not found');
        }
    };

    const handleAddFriendClick = (name: string) => {
        const friend = allProfiles?.find(profile => profile.name === name);
        const friendId = friend?.id;
        if (friendId) {
            addFriend({profileId: currentUser.id, friendId}, {
                onSuccess: () => {
                    setFriendsSet(prev => {
                        const newSet = new Set(prev);
                        newSet.add(friend.userName);
                        return newSet;
                    });
                }
            });
        } else {
            console.error('Friend not found');
        }
    };

    if (isLoading) {
        return <Typography>{t("Loading profiles...")}</Typography>;
    }

    if (isError) {
        return <Typography>{t("Error loading profiles")}</Typography>;
    }

    const displayedProfiles = searchTerm
        ? allProfiles?.filter(profile =>
            (profile.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                profile.userName.toLowerCase().includes(searchTerm.toLowerCase())) &&
            profile.userName !== currentUser.userName
        ).slice(0, 10)
        : filteredFriends;

    return (
        <Card sx={{
            width: '28%',
            flexGrow: 1,
            display: 'flex',
            flexDirection: 'column'
        }} className={"profile-background-friends"}>
            <CardContent sx={{flexGrow: 1, display: 'flex', flexDirection: 'column'}}>
                <Typography variant="h5" mb={2} color="textSecondary">{t("Friends")}</Typography>
                <TextField
                    fullWidth
                    variant="outlined"
                    placeholder={t("Search for friends...")}
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
                    }}/>
                <Box sx={{
                    flexGrow: 1,
                    overflowY: 'auto',
                    mt: 2,
                    maxHeight: {
                        xs: '480px',
                        '@media (min-width:1176px)': {
                            maxHeight: '780px'
                        }

                    }
                }}>                    {displayedProfiles && displayedProfiles.length > 0 ? (
                    <ProfileList
                        profiles={displayedProfiles}
                        friendsSet={friendsSet}
                        handleProfileClick={handleProfileClick}
                        handleRemoveFriendClick={handleRemoveFriendClick}
                        handleAddFriendClick={handleAddFriendClick}
                    />
                ) : (
                    <Box display="flex" justifyContent="center" alignItems="center" sx={{pt: 2}}>
                        <Typography color="textSecondary">{t("No friends found")}</Typography>
                    </Box>
                )}
                </Box>
            </CardContent>
        </Card>
    );
}

export default FriendsSection;