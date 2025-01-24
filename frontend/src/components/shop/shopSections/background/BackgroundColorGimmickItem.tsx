import {Box, Button, Card, CardContent, Grid2 as Grid, Tooltip, Typography} from '@mui/material';
import {Gimmick} from '../../../../model/profile/Gimmick.ts';
import {usePurchaseGimmick} from '../../../../hooks/useGimmickShop.ts';
import {useTranslation} from 'react-i18next';

interface BackgroundColorGimmickItemProps {
    gimmick: Gimmick,
    profileId: string,
    playerPoints: number,
    setSnackbarOpen?: ((value: (((prevState: boolean) => boolean) | boolean)) => void) | undefined,
    ownedGimmicks?: Gimmick[]
}

function BackgroundColorGimmickItem({
                                        gimmick,
                                        profileId,
                                        playerPoints,
                                        setSnackbarOpen,
                                        ownedGimmicks
                                    }: BackgroundColorGimmickItemProps) {
    const {t} = useTranslation();
    const {mutate: purchaseGimmick} = usePurchaseGimmick(gimmick.id, profileId, {
        onSuccess: () => setSnackbarOpen && setSnackbarOpen(true)
    });

    const handlePurchase = () => {
        if (playerPoints >= gimmick.numberOfLoyaltyPoints) {
            purchaseGimmick();
        } else {
            alert(t("Not enough points to purchase this gimmick."));
        }
    };

    const isOwned = ownedGimmicks?.some(ownedGimmick => ownedGimmick.id === gimmick.id);
    const backgroundColor = gimmick.name.replace('backgroundcolor', '').trim();

    return (
        <Grid component={"div"} sx={{minWidth: '150px', flexGrow: 1, flexBasis: 'auto'}} size={{xs: 12, sm: 6, md: 4}}>
            <Card className="shop-card-color"
                  sx={{backgroundColor, backgroundImage: backgroundColor ? 'none' : undefined}}>
                <CardContent>
                    <Box sx={{display: 'flex', alignItems: 'center'}}>
                        <Typography variant="subtitle1" sx={{backgroundColor}}>
                            {gimmick.name.replace('backgroundcolor', '').trim()}
                        </Typography>
                        <Typography sx={{paddingLeft: 1, backgroundColor}} variant="subtitle1">
                            {t('Price')}: {gimmick.numberOfLoyaltyPoints}
                        </Typography>
                    </Box>
                    {!isOwned && (
                        <Box sx={{display: 'flex', justifyContent: 'center', mt: 2}}>
                            <Tooltip
                                title={playerPoints < gimmick.numberOfLoyaltyPoints ? t("Not enough loyalty points to purchase") : ""}>
                                <span>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={handlePurchase}
                                        disabled={playerPoints < gimmick.numberOfLoyaltyPoints}
                                    >
                                        {t('Purchase')}
                                    </Button>
                                </span>
                            </Tooltip>
                        </Box>
                    )}
                </CardContent>
            </Card>
        </Grid>
    );
}

export default BackgroundColorGimmickItem;