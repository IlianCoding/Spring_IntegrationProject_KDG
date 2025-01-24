import {useContext, useEffect, useRef, useState} from 'react';
import {useGetProfile, usePutProfileAvatarUrl} from '../../hooks/useProfile.ts';
import {useGetAllAchievements} from '../../hooks/useAchievements.ts';
import {Alert, Box, CircularProgress, Container, Grid2 as Grid, IconButton} from '@mui/material';
import {useLocation, useNavigate} from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import 'animate.css';
import MainProfileSection from './profileSections/MainProfileSection.tsx';
import FriendsSection from './profileSections/FriendsSection/FriendsSection.tsx';
import AchievementsSection from './profileSections/AchievementSection/AchievementsSection.tsx';
import GimmicksSection from './profileSections/GimmicksSection/GimmicksSection.tsx';
import AvatarContextProvider from '../../contexts/profile/AvatarContextProvider.tsx';
import securityContext from "../../contexts/SecurityContext.ts";
import {playSound} from "../utils/playSound.ts";
import './profilePage.css';
import {CSSTransition} from 'react-transition-group';
import {useTranslation} from 'react-i18next';
import Navbar from "../navigation/Navbar.tsx";
import OngoingGamesSection from "./profileSections/OngoingGamesSection/OngoingGamesSection.tsx";
import GamesFromLastWeekSection from "./profileSections/GamesFromLastWeekSection/GamesFromLastWeekSection.tsx";

function ProfilePage() {
    const {t} = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();
    const {userId} = useContext(securityContext);
    const profileId = userId || '';
    const {data: profile, isLoading: isProfileLoading, isError: isProfileError} = useGetProfile(profileId);
    const {
        data: allAchievements,
        isLoading: isAchievementsLoading,
        isError: isAchievementsError
    } = useGetAllAchievements();
    const {mutate: updateAvatarUrl} = usePutProfileAvatarUrl();
    const [searchTerm, setSearchTerm] = useState('');
    const [playingSound, setPlayingSound] = useState<string | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const nodeRef = useRef(null);
    const previousPath = useRef(location.pathname);
    document.title = t("Profile") + " - Machiavelli";

    useEffect(() => {
        previousPath.current = location.pathname;
    }, [location.pathname]);

    if (isProfileLoading || isAchievementsLoading) {
        return <CircularProgress/>;
    }

    if (isProfileError || !profile || isAchievementsError || !allAchievements) {
        return <Alert severity="error">{t('Failed to load profile or achievements')}</Alert>;
    }

    const filteredFriends = profile.friends.filter(friend =>
        friend.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        friend.userName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const ownedAchievements = allAchievements.filter(achievement =>
        profile.achievements.some(userAchievement => userAchievement.id === achievement.id)
    );

    const unownedAchievements = allAchievements.filter(achievement =>
        !profile.achievements.some(userAchievement => userAchievement.id === achievement.id)
    );

    const sortedAchievements = [...ownedAchievements, ...unownedAchievements];

    const playSoundL = (gimmickName: string) => {
        playSound(gimmickName, setPlayingSound, playingSound);
    };

    const updateMainProfileAvatar = (newAvatarSrc: string) => {
        updateAvatarUrl({profileId: profile.id, avatarUrl: newAvatarSrc});
    };

    const handleBackClick = () => {
        if (previousPath.current === location.pathname) {
            navigate('/');
        } else {
            navigate(-1);
        }
    };

    return (
        <AvatarContextProvider>
            <Navbar/>
            <Container maxWidth="lg" className={isEditing ? "container-profile-editing" : "container-profile"}>
                <IconButton onClick={handleBackClick} sx={{
                    position: 'absolute',
                    top: {xs: 60, lg: 70, xl: 70},
                    left: {xs: 4, lg: 8, xl: 32},
                    fontFamily: 'MedievalSharp, cursive',
                    color: '#4B0082'
                }}>
                    <ArrowBackIcon fontSize="large"/>
                </IconButton>
                <Box sx={{padding: 5}}>
                    <MainProfileSection profile={profile} isEditing={isEditing} setIsEditing={setIsEditing}/>
                    <CSSTransition
                        in={!isEditing}
                        timeout={300}
                        classNames="fade"
                        unmountOnExit
                        nodeRef={nodeRef}
                    >
                        <Grid ref={nodeRef} container spacing={2}>
                            {!isEditing && (
                                <>
                                    <GimmicksSection profileGimmicks={profile.gimmicks}
                                                     activeGimmicks={profile.activeGimmicks}
                                                     playSound={playSoundL}
                                                     playingSound={playingSound}
                                                     updateMainProfileAvatar={updateMainProfileAvatar}
                                                     profileAvatarUrl={profile.avatarUrl}/>
                                    <FriendsSection filteredFriends={filteredFriends}
                                                    setSearchTerm={setSearchTerm}
                                                    currentUser={profile}/>
                                    <AchievementsSection sortedAchievements={sortedAchievements}
                                                         profileAchievements={profile.achievements}/>
                                    <OngoingGamesSection/>
                                    <GamesFromLastWeekSection/>
                                </>
                            )}
                        </Grid>
                    </CSSTransition>
                </Box>
            </Container>
        </AvatarContextProvider>
    );
}

export default ProfilePage;