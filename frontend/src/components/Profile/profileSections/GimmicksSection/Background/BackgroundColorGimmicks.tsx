import {Box, Grid2 as Grid, Typography} from '@mui/material';
import BackgroundColorGimmick from './BackgroundColorGimmick.tsx';
import {useTranslation} from 'react-i18next';
import {Gimmick} from "../../../../../model/profile/Gimmick.ts";

interface BackgroundColorGimmicksProps {
    profileGimmicks: Gimmick[];
    activeGimmicks: Gimmick[];
}

function BackgroundColorGimmicks({profileGimmicks, activeGimmicks}: BackgroundColorGimmicksProps) {
    const {t} = useTranslation();
    return (
        <Box>
            <Typography variant="h6" color="textSecondary" mb={2}>{t("Background Color Gimmicks")}</Typography>
            <Grid container spacing={2}>
                {profileGimmicks.filter(gimmick => gimmick.type.toLowerCase() === 'backgroundcolor').length > 0 ? (
                    profileGimmicks.filter(gimmick => gimmick.type.toLowerCase() === 'backgroundcolor').map((gimmick, index) => (
                        <BackgroundColorGimmick key={gimmick.id || index} gimmick={gimmick}
                                                activeGimmicks={activeGimmicks}/>
                    ))
                ) : (
                    <Typography variant="body2" color="textSecondary">
                        {t("No background color gimmicks available maybe you should get some?")}
                    </Typography>
                )}
            </Grid>
        </Box>
    );
}

export default BackgroundColorGimmicks;