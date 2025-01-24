import {Card, CardContent, Grid2 as Grid, Typography} from '@mui/material';
import {Profile} from '../../../../model/profile/Profile.ts';
import AvatarGimmickItem from './AvatarGimmickItem.tsx';
import {Gimmick} from "../../../../model/profile/Gimmick.ts";
import {useTranslation} from 'react-i18next';

interface AvatarGimmicksProps {
    profile: Profile,
    setSnackbarOpen?: (value: (((prevState: boolean) => boolean) | boolean)) => void,
    filteredGimmicks?: Gimmick[]
}

function AvatarGimmicks({profile, setSnackbarOpen, filteredGimmicks}: AvatarGimmicksProps) {
    const {t} = useTranslation();
    const availableGimmicks = filteredGimmicks?.filter(gimmick => gimmick.type === 'AVATAR') || [];

    return (
        <Grid container spacing={2} sx={{width: '100%'}}>
            {availableGimmicks?.length > 0 ? (
                availableGimmicks.map((gimmick, index) => (
                    <AvatarGimmickItem
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
                                {t('You have all the available avatar gimmicks. Or check your filtering options.')}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            )}
        </Grid>
    );
}

export default AvatarGimmicks;