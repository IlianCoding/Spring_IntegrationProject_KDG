import {Card, CardContent, Grid2 as Grid, Typography} from '@mui/material';
import {Profile} from '../../../../model/profile/Profile.ts';
import BackgroundColorGimmickItem from './BackgroundColorGimmickItem.tsx';
import {Gimmick} from "../../../../model/profile/Gimmick.ts";
import {useTranslation} from 'react-i18next';

interface BackgroundColorGimmicksProps {
    profile: Profile,
    setSnackbarOpen?: (value: (((prevState: boolean) => boolean) | boolean)) => void,
    filteredGimmicks?: Gimmick[]
}

function BackgroundColorGimmicks({profile, setSnackbarOpen, filteredGimmicks}: BackgroundColorGimmicksProps) {
    const {t} = useTranslation();
    const availableGimmicks = filteredGimmicks?.filter(gimmick => gimmick.type === 'BACKGROUNDCOLOR') || [];
    return (
        <Grid container spacing={2} sx={{width: '100%'}}>
            {availableGimmicks?.length > 0 ? (
                availableGimmicks.map((gimmick, index) => (
                    <BackgroundColorGimmickItem
                        key={index}
                        gimmick={gimmick}
                        profileId={profile.id}
                        playerPoints={profile.numberOfLoyaltyPoints}
                        setSnackbarOpen={setSnackbarOpen}
                        ownedGimmicks={profile.gimmicks}
                    />
                ))
            ) : (
                <Grid size={{xs: 12}}>
                    <Card className="shop-card-empty">
                        <CardContent>
                            <Typography variant="h6">
                                {t('You have all the available background color gimmicks. Or check your filtering options.')}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            )}
        </Grid>
    );
}

export default BackgroundColorGimmicks;