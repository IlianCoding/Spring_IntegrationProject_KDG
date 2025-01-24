import {Link, useNavigate} from 'react-router-dom';
import {Box, Button, CircularProgress, Container, Typography} from '@mui/material';
import Navbar from "../navigation/Navbar.tsx";
import {useContext, useEffect, useState} from "react";
import SecurityContext from "../../contexts/SecurityContext.ts";
import {useTranslation} from 'react-i18next';
import {useCreateLobby} from "../../hooks/useLobbyActions.ts";
import {keyframes} from '@emotion/react';

const fadeIn = keyframes`
    from {
        opacity: 0;
        transform: translateY(-20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
`;

const buttonStyles = {
    mb: 2,
    '&.fade-in': {
        animation: `${fadeIn} 0.5s ease-in-out`,
    },
    transition: 'transform 0.3s ease-in-out',
    '&:hover': {
        transform: 'scale(1.1)',
    },
};

const HomePage = () => {
    const {t} = useTranslation();
    const {userId, loading, isAuthenticated} = useContext(SecurityContext)
    const profileId = userId || '';
    const {mutate, data, isPending, isError} = useCreateLobby();
    const navigate = useNavigate();
    const [initialAnimation] = useState(true);

    document.title = "Home - Machiavelli";

    useEffect(() => {
        if (data) {
            navigate(`/lobby/${data.id}`)
        }
    }, [data]);

    const handleLobbyButtonClick = () => {
        mutate(profileId)
    }

    if (isPending || loading) {
        return (
            <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh'}}>
                <CircularProgress/>
            </Box>
        );
    }

    if (isError) {
        return <Typography>{t("Error creating lobby")}</Typography>;
    }

    return (
        <Box sx={{height: '100vh'}}>
            <Navbar/>
            <Container maxWidth="md" sx={{mt: 4, textAlign: 'center'}}>
                <Typography variant="h2" gutterBottom
                            sx={{mb: 8, textShadow: '1px 1px 2px rgba(138, 80, 226, 1)'}}>Machiavelli</Typography>
                {!isAuthenticated() && (
                    <Typography variant="h5" sx={{mt: 2, textShadow: '1px 1px 2px rgba(138, 80, 226, 1)'}}>
                        {t("Please log in to have full access to the website")}
                    </Typography>
                )}
                <Box mt={20} sx={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                    {isAuthenticated() ? (
                        <>
                            <Button
                                onClick={handleLobbyButtonClick}
                                className={initialAnimation ? "fade-in" : ""}
                                sx={buttonStyles}
                            >
                                {t("Start a game")}
                            </Button>
                            <Button
                                variant="contained"
                                component={Link}
                                to="/lobbies"
                                className={initialAnimation ? "fade-in" : ""}
                                sx={buttonStyles}
                            >
                                {t("Join a game")}
                            </Button>
                        </>
                    ) : (
                        <></>
                    )}
                    <Button
                        variant="contained"
                        component={Link}
                        to="/leaderboard"
                        className={initialAnimation ? "fade-in" : ""}
                        sx={buttonStyles}
                    >
                        {t('Leaderboard')}
                    </Button>
                </Box>
            </Container>
        </Box>
    )
};

export default HomePage;