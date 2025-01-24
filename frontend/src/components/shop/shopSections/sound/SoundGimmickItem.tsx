import {Box, Button, Card, CardContent, Grid2 as Grid, IconButton, Tooltip, Typography} from '@mui/material';
import {Gimmick} from '../../../../model/profile/Gimmick.ts';
import {usePurchaseGimmick} from '../../../../hooks/useGimmickShop.ts';
import VolumeOffSharpIcon from '@mui/icons-material/VolumeOffSharp';
import VolumeUpSharpIcon from '@mui/icons-material/VolumeUpSharp';
import 'animate.css/animate.min.css';
import {useTranslation} from 'react-i18next';

interface SoundGimmickItemProps {
    gimmick: Gimmick,
    profileId: string,
    playerPoints: number,
    playSound: (gimmickName: string) => void,
    playingSound: string | null,
    setSnackbarOpen?: ((value: (((prevState: boolean) => boolean) | boolean)) => void) | undefined,
    ownedGimmicks?: Gimmick[]
}

function SoundGimmickItem({
                              gimmick,
                              profileId,
                              playerPoints,
                              playSound,
                              playingSound,
                              setSnackbarOpen,
                              ownedGimmicks
                          }: SoundGimmickItemProps) {
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

    return (
        <Grid component={"div"} sx={{minWidth: '170px', flexGrow: 1, flexBasis: 'auto'}} size={{xs: 12, sm: 6, md: 4}}>
            <Card className="shop-card">
                <CardContent>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Typography variant="subtitle1"
                        >{gimmick.name}</Typography>
                        <Typography sx={{paddingLeft: 1}} variant="subtitle1"
                        >{t('Price')}: {gimmick.numberOfLoyaltyPoints}</Typography>
                        <Tooltip title={playingSound === gimmick.name ? t("Sound is playing") : t("Play Sound")}>
                            <IconButton
                                onClick={() => playSound(gimmick.name)}
                                sx={{'&:focus': {outline: 'none'}}}
                            >
                                {playingSound === gimmick.name ? (
                                    <VolumeOffSharpIcon className="animate__animated animate__rubberBand"
                                                        sx={{color: '#4B0082'}}/>
                                ) : (
                                    <VolumeUpSharpIcon sx={{color: '#4B0082'}}/>
                                )}
                            </IconButton>
                        </Tooltip>
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

export default SoundGimmickItem;