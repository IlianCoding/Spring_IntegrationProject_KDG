import {Card, CardContent, Grid2 as Grid, Typography} from '@mui/material';
import {Profile} from '../../../../model/profile/Profile.ts';
import SoundGimmickItem from './SoundGimmickItem.tsx';
import {Gimmick} from "../../../../model/profile/Gimmick.ts";
import {useTranslation} from 'react-i18next';

interface SoundGimmicksProps {
    profile: Profile,
    playSound: (gimmickName: string) => void,
    playingSound: string | null,
    setSnackbarOpen?: (value: (((prevState: boolean) => boolean) | boolean)) => void,
    filteredGimmicks?: Gimmick[]
}

function SoundGimmicks({profile, playSound, playingSound, setSnackbarOpen, filteredGimmicks}: SoundGimmicksProps) {
    const {t} = useTranslation();
    const availableGimmicks = filteredGimmicks?.filter(gimmick =>
        gimmick.type === 'SOUND') || [];


    return (
        <Grid container spacing={2} sx={{width: '100%'}}>
            {availableGimmicks?.length > 0 ? (
                availableGimmicks.map((gimmick, index) => (
                    <SoundGimmickItem
                        key={index}
                        gimmick={gimmick}
                        profileId={profile.id}
                        playerPoints={profile.numberOfLoyaltyPoints}
                        playSound={playSound}
                        playingSound={playingSound}
                        setSnackbarOpen={setSnackbarOpen}
                        ownedGimmicks={profile.gimmicks}
                    />
                ))
            ) : (
                <Grid size={{xs: 12}}>
                    <Card className="shop-card-empty">
                        <CardContent>
                            <Typography variant="h6">
                                {t('You have all the available sound gimmicks. Or check your filtering options.')}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            )}
        </Grid>
    );
}

export default SoundGimmicks;