import {useLocation, useNavigate, useParams} from 'react-router-dom';
import {useGetFriendProfile} from '../../hooks/useProfile.ts';
import {useGetAllAchievements} from '../../hooks/useAchievements.ts';
import {Alert, Box, CircularProgress, Container, Grid2 as Grid, IconButton} from '@mui/material';
import MainProfileSection from './profileSections/MainProfileSection.tsx';
import AchievementsSection from './profileSections/AchievementSection/AchievementsSection.tsx';
import {useTranslation} from "react-i18next";
import Navbar from "../navigation/Navbar.tsx";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {useRef} from "react";

function FriendProfilePage() {
    const {t} = useTranslation();
    const {name, userName} = useParams<{ name: string, userName: string }>();
    const location = useLocation();
    const navigate = useNavigate();
    const previousPath = useRef(location.pathname);
    const {data: profile, isLoading: isProfileLoading, isError: isProfileError} = useGetFriendProfile(name, userName);
    const {
        data: allAchievements,
        isLoading: isAchievementsLoading,
        isError: isAchievementsError
    } = useGetAllAchievements();

    if (isProfileLoading || isAchievementsLoading) {
        return <CircularProgress/>;
    }

    if (isProfileError || !profile || isAchievementsError || !allAchievements) {
        return <Alert severity="error">{t('Failed to load profile or achievements')}</Alert>;
    }

    const ownedAchievements = allAchievements.filter(achievement =>
        profile.achievements.some(userAchievement => userAchievement.id === achievement.id)
    );

    const unownedAchievements = allAchievements.filter(achievement =>
        !profile.achievements.some(userAchievement => userAchievement.id === achievement.id)
    );

    const sortedAchievements = [...ownedAchievements, ...unownedAchievements];

    const handleBackClick = () => {
        if (previousPath.current === location.pathname) {
            navigate('/profile');
        } else {
            navigate(-1);
        }
    };
    
    return (
        <Box>
            <Navbar/>
            <IconButton onClick={handleBackClick} sx={{
                position: 'absolute',
                top: {xs: 60, lg: 70, xl: 70},
                left: {xs: 4, lg: 8, xl: 32},
                fontFamily: 'MedievalSharp, cursive',
                color: '#4B0082'
            }}>
                <ArrowBackIcon fontSize="large"/>
            </IconButton>
            <Container maxWidth="lg" sx={{marginTop: 5}} className="container-profile-friend">
                <Grid container spacing={2} sx={{padding: 5}}>
                    <MainProfileSection profile={profile}/>
                    <AchievementsSection sortedAchievements={sortedAchievements}
                                         profileAchievements={profile.achievements}/>
                </Grid>
            </Container>
        </Box>
    );
}

export default FriendProfilePage;