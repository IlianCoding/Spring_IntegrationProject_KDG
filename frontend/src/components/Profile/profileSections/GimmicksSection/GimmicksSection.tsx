import {Box, Button, Card, CardContent, Typography, useMediaQuery} from '@mui/material';
import {Link} from 'react-router-dom';
import {Gimmick} from '../../../../model/profile/Gimmick.ts';
import BackgroundColorGimmicks from './Background/BackgroundColorGimmicks.tsx';
import SoundGimmicks from './Sound/SoundGimmicks.tsx';
import AvatarGimmicks from './Avatar/AvatarGimmicks.tsx';
import {useTranslation} from 'react-i18next';

interface GimmicksSectionProps {
    profileGimmicks: Gimmick[];
    playSound: (gimmickName: string) => void;
    playingSound: string | null;
    updateMainProfileAvatar: (avatarSrc: string) => void;
    profileAvatarUrl: string;
    activeGimmicks: Gimmick[];
}

function GimmicksSection({
                             profileGimmicks,
                             playSound,
                             playingSound,
                             updateMainProfileAvatar,
                             profileAvatarUrl,
                             activeGimmicks
                         }: GimmicksSectionProps) {
    const {t} = useTranslation();
    const isSmallScreen = useMediaQuery('(max-width:1175px)');
    return (
        <Card className={"profile-background"} sx={{width: isSmallScreen ? '100%' : '70%'}}>
            <CardContent>
                <Box display="flex" justifyContent="space-between" mb={2}>
                    <Typography variant="h5" color="textSecondary">{t("Owned Gimmicks")}</Typography>
                    <Button variant="contained" component={Link} to="/shop">{t("Get More")}</Button>
                </Box>
                <BackgroundColorGimmicks profileGimmicks={profileGimmicks} activeGimmicks={activeGimmicks}/>
                <SoundGimmicks profileGimmicks={profileGimmicks} playSound={playSound} playingSound={playingSound}
                               activeGimmicks={activeGimmicks}/>
                <AvatarGimmicks profileGimmicks={profileGimmicks} updateMainProfileAvatar={updateMainProfileAvatar}
                                profileAvatarUrl={profileAvatarUrl}/>
            </CardContent>
        </Card>
    );
}

export default GimmicksSection;