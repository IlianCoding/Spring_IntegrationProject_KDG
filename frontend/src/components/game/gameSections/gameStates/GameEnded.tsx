import {Box, Button, CircularProgress, Container, Typography} from '@mui/material';
import {useTranslation} from 'react-i18next';
import Scoreboard from './scoreboard/Scoreboard';
import {useNavigate} from 'react-router-dom';
import {useGetLobby, useLobbyGames, useMakeChoiceAfterGame} from '../../../../hooks/useLobbyActions.ts';
import useGameContext from '../../../../hooks/useGameContext.ts';
import {useContext, useEffect, useState} from "react";
import SecurityContext from "../../../../contexts/SecurityContext.ts";

const GameEnded = () => {
    const {t} = useTranslation();
    const {userId} = useContext(SecurityContext);
    const navigate = useNavigate();
    const {game, isLoadingGame} = useGameContext();
    const {data: lobby, isLoading: isLoadingLobby} = useGetLobby(game?.lobby?.id || '');
    const {data: lobbyGames, isLoading: isLoadingLobbyGames} = useLobbyGames(game?.lobby?.id || '');
    const {mutate: makeChoiceAfterGame} = useMakeChoiceAfterGame(game?.lobby?.id || '');
    const [timer, setTimer] = useState(60);

    useEffect(() => {
        const initialGamesLength = localStorage.getItem('initialGamesLength');
        if (!initialGamesLength && lobbyGames) {
            localStorage.setItem('initialGamesLength', lobbyGames.length.toString());
        }
    }, [lobbyGames]);

    useEffect(() => {
        const interval = setInterval(() => {
            setTimer((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const initialGamesLength = parseInt(localStorage.getItem('initialGamesLength') || '0', 10);
        if (!isLoadingLobby && !isLoadingLobbyGames && lobby && lobbyGames) {
            if (timer < 1 && lobby.profiles.length === 0) {
                navigate('/lobbies');
            } else if (timer < 1 && lobbyGames.length > initialGamesLength) {
                navigate(`/lobby/${lobby.id}`);
            } else if (timer < 1) {
                window.location.reload();
            }
        }
    }, [isLoadingLobby, isLoadingLobbyGames, lobby, lobbyGames, navigate, timer]);

    if (isLoadingLobbyGames || isLoadingGame) {
        return (
            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundImage: 'url("https://img.freepik.com/free-photo/wooden-floor-background_53876-88628.jpg?t=st=1734941126~exp=1734944726~hmac=5ec16ce1beee4e0fb50a47948617b7327c054e72de79f6a07d167642eeb123d3&w=1380")',
                backgroundSize: 'cover',
                width: '10%',
                fontFamily: 'MedievalSharp, cursive',
                color: '#4B0082',
                marginLeft: '100vw',
                marginTop: '20vh'
            }}>
                <CircularProgress/>
                <Typography variant="h6" sx={{mt: 2}}>
                    {t('Loading...')}
                </Typography>
            </Box>
        );
    }

    const currentUserId = userId || '';
    const isOwner = game?.lobby?.profiles[0]?.id === currentUserId;

    const handleChoice = (choice: boolean) => {
        makeChoiceAfterGame(choice, {
            onSuccess: () => {
                if (choice) {
                    navigate(`/lobby/${game?.lobby?.id}`);
                } else {
                    navigate('/lobbies');
                }
            },
            onError: (error) => {
                console.error('Error making choice after game:', error);
            }
        });
    };

    return (
        <Container maxWidth="lg" sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100vh',
            fontFamily: 'MedievalSharp, cursive',
            color: '#4B0082'
        }}>
            <Box sx={{
                textAlign: 'center',
                mb: 4,
                backgroundImage: 'url("https://img.freepik.com/free-photo/wooden-floor-background_53876-88628.jpg?t=st=1734941126~exp=1734944726~hmac=5ec16ce1beee4e0fb50a47948617b7327c054e72de79f6a07d167642eeb123d3&w=1380")',
                backgroundSize: 'cover',
                borderRadius: '8px',
                maxWidth: '70%',
                padding: '20px',
            }}>
                <Typography sx={{paddingTop: 2}} variant="h4" component="h1" gutterBottom>
                    {t('Game has ended')}
                </Typography>
                <Scoreboard/>
                {isOwner ? (
                    <Box sx={{textAlign: 'center', mt: 4}}>
                        <Typography variant="h6" component="h2" gutterBottom>
                            {t('Do you want to start a new game with the same players?')}
                        </Typography>
                        <Button variant="contained" color="primary" onClick={() => handleChoice(true)} sx={{mr: 2}}>
                            {t('Yes')}
                        </Button>
                        <Button variant="contained" color="secondary" onClick={() => handleChoice(false)}>
                            {t('No')}
                        </Button>
                    </Box>
                ) : (
                    <Box sx={{textAlign: 'center', mt: 4}}>
                        <Typography variant="h6" component="h2" gutterBottom>
                            {t('The lobby owner is deciding whether to start a new game or close the lobby.')}
                        </Typography>
                        <Typography variant="body1" component="p" gutterBottom>
                            {t('You will be redirected in {{timer}} seconds. If the lobby owner has made a choice otherwise the page will reload.', {timer})}
                        </Typography>
                    </Box>
                )}
            </Box>
        </Container>
    );
};

export default GameEnded;