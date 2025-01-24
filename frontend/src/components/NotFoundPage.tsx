import {Box, Button, Container, Typography} from '@mui/material';
import {useNavigate} from 'react-router-dom';
import {useTranslation} from 'react-i18next';

function NotFoundPage() {
    const navigate = useNavigate();
    const {t} = useTranslation();
    document.title = t('Page Not Found');
    
    return (
        <Container maxWidth="sm" sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100vh'
        }}>
            <Box sx={{textAlign: 'center', mb: 4}}>
                <Typography variant="h4" component="h1" gutterBottom>
                    {t('Page Not Found')}
                </Typography>
                <Typography variant="body1">
                    {t('The page you are looking for does not exist. Please check the URL and try again.')}
                </Typography>
            </Box>
            <Button variant="contained" color="primary" onClick={() => navigate('/')}>
                {t('Go to Home')}
            </Button>
        </Container>
    );
}

export default NotFoundPage;