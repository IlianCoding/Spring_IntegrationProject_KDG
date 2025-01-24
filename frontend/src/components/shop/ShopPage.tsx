import React, {useContext, useState} from 'react';
import {useGetProfile} from '../../hooks/useProfile';
import {
    Alert,
    Box,
    Card,
    CardContent,
    Checkbox,
    CircularProgress,
    Container,
    FormControlLabel,
    Grid2 as Grid,
    Slider,
    Snackbar,
    Tab,
    Tabs,
    TextField,
    Typography
} from '@mui/material';
import securityContext from "../../contexts/SecurityContext.ts";
import {playSound} from "../utils/playSound";
import BackgroundColorGimmicks from './shopSections/background/BackgroundColorGimmicks';
import AvatarGimmicks from './shopSections/avatar/AvatarGimmicks';
import SoundGimmicks from './shopSections/sound/SoundGimmicks';
import LoyaltyIcon from '@mui/icons-material/Loyalty';
import './shopPage.css';
import ShopIcon from "@mui/icons-material/Shop";
import {useGetGimmicks} from "../../hooks/useGimmickShop";
import {useTranslation} from 'react-i18next';
import BackButton from './shopSections/BackButton';
import Navbar from "../navigation/Navbar.tsx";

function ShopPage() {
    const {t} = useTranslation();
    const {userId} = useContext(securityContext);
    const profileId = userId || '';
    const {data: profile, isLoading, isError} = useGetProfile(profileId);
    const [tabIndex, setTabIndex] = useState(0);
    const [playingSound, setPlayingSound] = useState<string | null>(null);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [priceRange, setPriceRange] = useState<number[]>([0, 200]);
    const [showAllGimmicks, setShowAllGimmicks] = useState(false);
    const {data: allGimmicks, isLoading: isLoadingGimmicks, isError: isErrorGimmicks} = useGetGimmicks();
    document.title = "Gimmick Shop - Machiavelli";

    if (isLoading || isLoadingGimmicks || !profile) {
        return <CircularProgress/>;
    }

    if (isError || isErrorGimmicks) {
        return <Alert severity="error">{t('Failed to load profile')}</Alert>;
    }

    const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
        setTabIndex(newValue);
    };

    const playSoundL = (gimmickName: string) => {
        playSound(gimmickName, setPlayingSound, playingSound);
    };

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    const filteredGimmicks = (allGimmicks || []).filter(gimmick => {
        const matchesSearchTerm = !searchTerm.trim() || gimmick.name.toLowerCase().includes(searchTerm.toLowerCase().trim());
        const matchesPriceRange = gimmick.numberOfLoyaltyPoints >= priceRange[0] && gimmick.numberOfLoyaltyPoints <= priceRange[1];
        const matchesOwnership = showAllGimmicks || !profile.gimmicks.some(pg => pg.id === gimmick.id);
        return matchesSearchTerm && matchesPriceRange && matchesOwnership;
    });

    return (
        <Box className="shop">
            <Navbar/>
            <Container sx={{
                maxWidth: {
                    xs: '100%',
                    sm: '100%',
                    md: '880px',
                    lg: '1180px',
                    xl: '1420px'
                },
            }}
                       className="shopContainer"
            >
                <Grid container spacing={2}>
                    <Grid className="shop-title" size={{xs: 12}} mb={2}>
                        <Box display="flex" alignItems="center">
                            <BackButton/>
                            <Typography variant="h3" gutterBottom className="typography-h3">
                                {t('Welcome to the Gimmick Shop')}
                                <ShopIcon fontSize={"large"} sx={{mr: 1, marginX: 1}}/>
                            </Typography>
                        </Box>

                        <Tabs value={tabIndex} onChange={handleTabChange} className="tabs">
                            <Tab label={t('Background Colors')} className="tab"/>
                            <Tab label={t('Avatars')} className="tab"/>
                            <Tab label={t('Sounds')} className="tab"/>
                        </Tabs>
                    </Grid>
                    <Grid size={{xs: 12, md: 3}}>
                        <Card className="shop-card">
                            <CardContent>
                                <Typography variant="h5" gutterBottom className="typography-h5">
                                    <LoyaltyIcon sx={{mr: 1}}/> {t('Loyalty Points')}: {profile.numberOfLoyaltyPoints}
                                </Typography>
                                <TextField
                                    label={t('Search')}
                                    variant="outlined"
                                    fullWidth
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    sx={{mt: 2}}
                                />
                                <Typography variant="h6" gutterBottom sx={{mt: 2}}>
                                    {t('Price Range')}
                                </Typography>
                                <Slider
                                    value={priceRange}
                                    onChange={(_e, newValue) => setPriceRange(newValue as number[])}
                                    valueLabelDisplay="auto"
                                    min={0}
                                    max={200}
                                    sx={{mt: 2}}
                                />
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={showAllGimmicks}
                                            onChange={(e) => setShowAllGimmicks(e.target.checked)}
                                        />
                                    }
                                    label={t('Show all')}
                                    sx={{mt: 2}}
                                />
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid size={{xs: 12, md: 9}}>
                        <Box display="flex" flexDirection="column"
                             justifyContent="flex-start"
                             alignItems="flex-start">
                            {tabIndex === 0 &&
                                <BackgroundColorGimmicks profile={profile} setSnackbarOpen={setSnackbarOpen}
                                                         filteredGimmicks={filteredGimmicks}/>}
                            {tabIndex === 1 && <AvatarGimmicks profile={profile} setSnackbarOpen={setSnackbarOpen}
                                                               filteredGimmicks={filteredGimmicks}/>}
                            {tabIndex === 2 &&
                                <SoundGimmicks profile={profile} playSound={playSoundL} playingSound={playingSound}
                                               setSnackbarOpen={setSnackbarOpen} filteredGimmicks={filteredGimmicks}/>}
                        </Box>
                    </Grid>
                </Grid>
            </Container>
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={handleSnackbarClose}
                message={t('Purchase successful!')}
                anchorOrigin={{vertical: 'top', horizontal: 'right'}}
                ContentProps={{
                    sx: {backgroundColor: '#4B0082', color: "white"}
                }}
            />
        </Box>
    );
}

export default ShopPage;