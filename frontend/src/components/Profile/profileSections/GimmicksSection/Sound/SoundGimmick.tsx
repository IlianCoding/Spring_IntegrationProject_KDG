import {Box, Button, Card, CardContent, Grid2 as Grid, IconButton, Tooltip, Typography} from '@mui/material';
import VolumeOffSharpIcon from '@mui/icons-material/VolumeOffSharp';
import VolumeUpSharpIcon from '@mui/icons-material/VolumeUpSharp';
import 'animate.css/animate.min.css';
import {useContext} from "react";
import {useTranslation} from 'react-i18next';
import SecurityContext from "../../../../../contexts/SecurityContext.ts";
import {useActivateGimmick, useDeactivateGimmick} from "../../../../../hooks/useProfile.ts";
import {Gimmick} from "../../../../../model/profile/Gimmick.ts";

interface SoundGimmickProps {
    gimmick: Gimmick;
    activeGimmicks: Gimmick[];
    playSound: (gimmickName: string) => void;
    playingSound: string | null;
}

function SoundGimmick({gimmick, activeGimmicks, playSound, playingSound}: SoundGimmickProps) {
    const {t} = useTranslation();
    const {userId} = useContext(SecurityContext);
    const profileId = userId || '';
    const {mutate: activateGimmick} = useActivateGimmick();
    const {mutate: deactivateGimmick} = useDeactivateGimmick();

    const extractCharacterFromName = (name: string) => {
        return name.split(":")[1].trim();
    };

    const handleActivate = () => {
        const character = extractCharacterFromName(gimmick.name);
        const conflictingGimmick = activeGimmicks.find(g => g.type.toLowerCase() === 'sound' && extractCharacterFromName(g.name) === character);
        if (conflictingGimmick) {
            if (window.confirm(t("A gimmick with the same character is already active. Do you want to deactivate it and activate the new one?"))) {
                deactivateGimmick({profileId, gimmickId: conflictingGimmick.id});
                setTimeout(() => {
                    activateGimmick({profileId, gimmickId: gimmick.id});
                }, 200);
            }
        } else {
            activateGimmick({profileId, gimmickId: gimmick.id});
        }
    };

    const handleDeactivate = () => {
        deactivateGimmick({profileId, gimmickId: gimmick.id});
    };

    return (
        <Grid size={{xs: 12, sm: 6, md: 4}}>
            <Card className={"profile-background-card"} sx={{
                minHeight: {
                    xs: '161px',
                }
            }}>
                <CardContent>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Typography variant="subtitle1" color="textSecondary">{gimmick.name}</Typography>
                        <Tooltip title={playingSound === gimmick.name ? t("Sound is playing") : t("Play Sound")}>
                            <IconButton onClick={() => playSound(gimmick.name)} sx={{'&:focus': {outline: 'none'}}}>
                                {playingSound === gimmick.name ? (
                                    <VolumeOffSharpIcon className="animate__animated animate__rubberBand"/>
                                ) : (
                                    <VolumeUpSharpIcon/>
                                )}
                            </IconButton>
                        </Tooltip>
                    </Box>
                    {activeGimmicks.some(activeGimmick => activeGimmick.id === gimmick.id) ? (
                        <Button variant="contained" color="secondary" onClick={handleDeactivate} sx={{mt: 2}}>
                            {t("Deactivate")}
                        </Button>
                    ) : (
                        <Button variant="contained" color="primary" onClick={handleActivate} sx={{mt: 2}}>
                            {t("Activate")}
                        </Button>
                    )}
                </CardContent>
            </Card>
        </Grid>
    );
}

export default SoundGimmick;