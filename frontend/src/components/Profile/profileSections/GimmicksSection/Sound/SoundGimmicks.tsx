import {Box, Grid2 as Grid, Typography} from '@mui/material';
import SoundGimmick from './SoundGimmick.tsx';
import {useTranslation} from 'react-i18next';
import {Gimmick} from "../../../../../model/profile/Gimmick.ts";

interface SoundGimmicksProps {
    profileGimmicks: Gimmick[];
    activeGimmicks: Gimmick[];
    playSound: (gimmickName: string) => void;
    playingSound: string | null;
}

function SoundGimmicks({profileGimmicks, activeGimmicks, playSound, playingSound}: SoundGimmicksProps) {
    const {t} = useTranslation();
    return (
        <Box>
            <Typography variant="h6" color="textSecondary" mb={2} mt={4}>{t("Sound Gimmicks")}</Typography>
            <Grid container spacing={2}>
                {profileGimmicks.filter(gimmick => gimmick.type.toLowerCase() === 'sound').length > 0 ? (
                    profileGimmicks.filter(gimmick => gimmick.type.toLowerCase() === 'sound').map((gimmick, index) => (
                        <SoundGimmick key={gimmick.id || index} gimmick={gimmick} activeGimmicks={activeGimmicks}
                                      playSound={playSound} playingSound={playingSound}/>
                    ))
                ) : (
                    <Typography variant="body2" color="textSecondary">
                        {t("No sound gimmicks available maybe you should get some?")}
                    </Typography>
                )}
            </Grid>
        </Box>
    );
}

export default SoundGimmicks;