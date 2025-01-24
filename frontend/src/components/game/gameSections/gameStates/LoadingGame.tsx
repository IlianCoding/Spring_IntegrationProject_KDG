import {CircularProgress, Container, Typography} from '@mui/material';
import {useTranslation} from 'react-i18next';

const LoadingGame = () => {
    const {t} = useTranslation();
    return (
        <Container maxWidth="sm" sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '40vh',
            fontFamily: 'MedievalSharp, cursive',
            color: '#4B0082',
            backgroundImage: 'url("https://img.freepik.com/free-photo/wooden-floor-background_53876-88628.jpg?t=st=1734941126~exp=1734944726~hmac=5ec16ce1beee4e0fb50a47948617b7327c054e72de79f6a07d167642eeb123d3&w=1380")',
            backgroundSize: 'cover',
            borderRadius: '8px',
            padding: '20px',
        }}>
            <CircularProgress/>
            <Typography variant="h6" sx={{mt: 2, fontFamily: 'MedievalSharp, cursive', color: '#4B0082'}}>
                {t('Loading game...')}
            </Typography>
        </Container>
    );
};

export default LoadingGame;