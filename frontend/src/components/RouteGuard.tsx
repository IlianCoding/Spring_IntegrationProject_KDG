import {ReactNode, useContext} from 'react';
import {Box, Button, CircularProgress, Container, Typography} from '@mui/material';
import SecurityContext from '../contexts/SecurityContext.ts';
import {useTranslation} from 'react-i18next';
import {useNavigate} from "react-router-dom";

export interface RouteGuardProps {
    children: ReactNode;
}

export function RouteGuard({children}: RouteGuardProps) {
    const {isAuthenticated, login, loading} = useContext(SecurityContext);
    const {t} = useTranslation();
    const navigate = useNavigate();

    if (loading) {
        document.title = t('Checking authentication...');
        return (
            <Container maxWidth="sm" sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100vh',
                textAlign: 'center'
            }}>
                <Box sx={{backgroundColor: 'rgba(0, 0, 0, 0.5)', borderRadius: 8}}>
                    <CircularProgress size={120} thickness={6}/>
                    <Typography variant="h6" sx={{mt: 3}}>
                        {t('Checking authentication...')}
                    </Typography>
                </Box>
            </Container>
        );
    }

    if (isAuthenticated()) {
        return children;
    } else {
        navigate('/');
        document.title = t('Please Log In');
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
                        {t('Please Log In')}
                    </Typography>
                    <Typography variant="body1">
                        {t('You need to log in to access this page.')}
                    </Typography>
                </Box>
                <Button variant="contained" color="primary" onClick={login}>
                    {t('Login')}
                </Button>
            </Container>
        );
    }
}