import {Button, Card, CardContent, Grid2 as Grid, Typography} from '@mui/material';
import {useContext} from "react";
import {useTranslation} from 'react-i18next';
import SecurityContext from "../../../../../contexts/SecurityContext.ts";
import {useActivateGimmick, useDeactivateGimmick} from "../../../../../hooks/useProfile.ts";
import {Gimmick} from "../../../../../model/profile/Gimmick.ts";

interface BackgroundColorGimmickProps {
    gimmick: Gimmick;
    activeGimmicks: Gimmick[];
}

function BackgroundColorGimmick({gimmick, activeGimmicks}: BackgroundColorGimmickProps) {
    const {t} = useTranslation();
    const {userId} = useContext(SecurityContext);
    const profileId = userId || '';
    const {mutate: activateGimmick} = useActivateGimmick();
    const {mutate: deactivateGimmick} = useDeactivateGimmick();

    const handleActivate = () => {
        const conflictingGimmick = activeGimmicks.find(g => g.type.toLowerCase() === 'backgroundcolor') || null;
        if (conflictingGimmick) {
            if (window.confirm(t("A background color gimmick is already active. Do you want to deactivate it and activate the new one?"))) {
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
            <Card sx={{backgroundColor: gimmick.name.split(' ')[0].toLowerCase()}}>
                <CardContent>
                    <Typography variant="subtitle1">{gimmick.name.split(' ')[0]}</Typography>
                    {activeGimmicks.some(activeGimmick => activeGimmick.id === gimmick.id) ? (
                        <Button variant="contained" color="secondary" onClick={handleDeactivate}>
                            {t("Deactivate")}
                        </Button>
                    ) : (
                        <Button variant="contained" color="primary" onClick={handleActivate}>
                            {t("Activate")}
                        </Button>
                    )}
                </CardContent>
            </Card>
        </Grid>
    );
}

export default BackgroundColorGimmick;