import {Box, Container, Typography} from '@mui/material';
import {useTranslation} from 'react-i18next';

const GameNotStarted = () => {
    const {t} = useTranslation();
    return (
        <Container maxWidth="sm" sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '30vh',
            fontFamily: 'MedievalSharp, cursive',
            color: '#4B0082',
            backgroundImage: 'url("https://img.freepik.com/free-photo/wooden-floor-background_53876-88628.jpg?t=st=1734941126~exp=1734944726~hmac=5ec16ce1beee4e0fb50a47948617b7327c054e72de79f6a07d167642eeb123d3&w=1380")',
            backgroundSize: 'cover',
            borderRadius: '8px',
            padding: '20px',
        }}>
            <Box sx={{textAlign: 'center', mb: 4}}>
                <Typography variant="h4" component="h1" gutterBottom
                            sx={{fontFamily: 'MedievalSharp, cursive', color: '#4B0082'}}>
                    {t('Game Not Started')}
                </Typography>
                <Typography variant="body1" sx={{fontFamily: 'MedievalSharp, cursive', color: '#4B0082'}}>
                    {t('The game hasn\'t started yet. Please wait for the game to start.')}
                </Typography>
            </Box>
        </Container>
    );
};

export default GameNotStarted;