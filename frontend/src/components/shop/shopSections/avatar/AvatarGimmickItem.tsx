import {useEffect, useState} from 'react';
import {Avatar, Button, Card, CardContent, Grid2 as Grid, Tooltip, Typography} from '@mui/material';
import sanitizeFileName from "../../../utils/sanitizeFileName.ts";
import {Gimmick} from '../../../../model/profile/Gimmick.ts';
import {usePurchaseGimmick} from '../../../../hooks/useGimmickShop.ts';
import {useTranslation} from 'react-i18next';

interface AvatarGimmickItemProps {
    gimmick: Gimmick,
    profileId: string,
    playerPoints: number,
    setSnackbarOpen?: ((value: (((prevState: boolean) => boolean) | boolean)) => void) | undefined,
    ownedGimmicks?: Gimmick[]
}

function AvatarGimmickItem({gimmick, profileId, playerPoints, setSnackbarOpen, ownedGimmicks}: AvatarGimmickItemProps) {
    const {t} = useTranslation();
    const [avatarSrc, setAvatarSrc] = useState(`/assets/profile/avatars/${sanitizeFileName(gimmick.name)}.jpg`);
    const {mutate: purchaseGimmick} = usePurchaseGimmick(gimmick.id, profileId, {
        onSuccess: () => setSnackbarOpen && setSnackbarOpen(true)
    });

    useEffect(() => {
        setAvatarSrc(`/assets/profile/avatars/${sanitizeFileName(gimmick.name)}.jpg`);
    }, [gimmick]);

    const handleError = () => {
        setAvatarSrc(`/assets/profile/avatars/${sanitizeFileName(gimmick.name)}.jpeg`);
    };

    const handlePurchase = () => {
        if (playerPoints >= gimmick.numberOfLoyaltyPoints) {
            purchaseGimmick();
        } else {
            alert(t("Not enough points to purchase this gimmick."));
        }
    };

    const isOwned = ownedGimmicks?.some(ownedGimmick => ownedGimmick.id === gimmick.id);

    return (
        <Grid component={"div"} sx={{minWidth: '150px'}} size={{xs: 12, sm: 6, md: 4}}>
            <Card className="shop-card">
                <CardContent>
                    <Grid container direction="column" alignItems="center" spacing={0.5}>
                        <Grid>
                            <Avatar
                                src={avatarSrc}
                                onError={handleError}
                                alt={gimmick.name}
                                sx={{
                                    width: 80,
                                    height: 80,
                                    border: '4px solid #8B4513',
                                    borderRadius: '50%',
                                    boxShadow: '0 0 10px rgba(0, 0, 0, 0.5)'
                                }}
                            />
                        </Grid>
                        <Grid>
                            <Typography variant="subtitle1" align="center">
                                {gimmick.name}
                            </Typography>
                        </Grid>
                        <Grid>
                            <Typography variant="subtitle1">
                                {t('Price')}: {gimmick.numberOfLoyaltyPoints}
                            </Typography>
                        </Grid>
                        {!isOwned && (
                            <Grid>
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
                            </Grid>
                        )}
                    </Grid>
                </CardContent>
            </Card>
        </Grid>
    );
}

export default AvatarGimmickItem;