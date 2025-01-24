import {Box, Grid2 as Grid, Typography} from '@mui/material';
import {Gimmick} from '../../../../../model/profile/Gimmick.ts';
import AvatarGimmick from './AvatarGimmick.tsx';
import {useTranslation} from 'react-i18next';

interface AvatarGimmicksProps {
    profileGimmicks: Gimmick[];
    updateMainProfileAvatar: (avatarSrc: string) => void;
    profileAvatarUrl: string;
}

function AvatarGimmicks({profileGimmicks, updateMainProfileAvatar, profileAvatarUrl}: AvatarGimmicksProps) {
    const {t} = useTranslation();
    return (
        <Box>
            <Typography variant="h6" color="textSecondary" mb={2} mt={4}>{t("Avatar Gimmicks")}</Typography>
            <Grid container spacing={2}>
                {profileGimmicks.filter(gimmick => gimmick.type.toLowerCase() === 'avatar').length > 0 ? (
                    profileGimmicks.filter(gimmick => gimmick.type.toLowerCase() === 'avatar').map((gimmick, index) => (
                        <AvatarGimmick key={gimmick.id || index} gimmick={gimmick} index={index}
                                       updateMainProfileAvatar={updateMainProfileAvatar}
                                       profileAvatarUrl={profileAvatarUrl}/>
                    ))
                ) : (
                    <Typography variant="body2"
                                color="textSecondary">{t("No avatar gimmicks available maybe you should get some?")}</Typography>
                )}
            </Grid>
        </Box>
    );
}

export default AvatarGimmicks;