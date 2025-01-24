import {useEffect, useState} from 'react';
import {Avatar, Box, Card, CardContent, Grid2 as Grid, IconButton, Tooltip, Typography} from '@mui/material';
import FileDownloadDoneSharpIcon from '@mui/icons-material/FileDownloadDoneSharp';
import CheckCircleSharpIcon from '@mui/icons-material/CheckCircleSharp';
import {Gimmick} from "../../../../../model/profile/Gimmick.ts";
import sanitizeFileName from '../../../../utils/sanitizeFileName.ts';
import useAvatarContext from '../../../../../hooks/useAvatarContext.ts';
import {useTranslation} from 'react-i18next';

interface AvatarGimmickProps {
    gimmick: Gimmick;
    index: number;
    updateMainProfileAvatar: (avatarSrc: string) => void;
    profileAvatarUrl: string;
}

function AvatarGimmick({gimmick, index, updateMainProfileAvatar, profileAvatarUrl}: AvatarGimmickProps) {
    const {t} = useTranslation();
    const {appliedAvatarSrc, setAppliedAvatarSrc} = useAvatarContext();
    const [avatarSrc, setAvatarSrc] = useState(`/assets/profile/avatars/${sanitizeFileName(gimmick.name)}.jpg`);
    const [isApplied, setIsApplied] = useState(false);
    const [animationClass, setAnimationClass] = useState('');

    useEffect(() => {
        setIsApplied(appliedAvatarSrc === avatarSrc || profileAvatarUrl === avatarSrc);
    }, [appliedAvatarSrc, avatarSrc, profileAvatarUrl]);

    const handleError = () => {
        setAvatarSrc(`/assets/profile/avatars/${sanitizeFileName(gimmick.name)}.jpeg`);
    };

    const applyAvatar = () => {
        updateMainProfileAvatar(avatarSrc);
        setAppliedAvatarSrc(avatarSrc);
        setAnimationClass('animate__animated animate__rubberBand');
        setTimeout(() => setAnimationClass(''), 1000);
    };

    return (
        <Grid key={index} size={{xs: 12, sm: 4, md: 3}}>
            <Card className={"profile-background-card"}>
                <CardContent>
                    <Box display="flex" flexDirection="column" alignItems="center" position="relative">
                        <Avatar
                            sx={{width: 80, height: 80}}
                            src={avatarSrc}
                            onError={handleError}
                        />
                        <Tooltip title={isApplied ? t("This avatar is applied") : t("Apply avatar")}>
                            <IconButton
                                sx={{
                                    position: 'absolute',
                                    top: 0,
                                    right: 0,
                                    '&:focus': {outline: 'none'}
                                }}
                                onClick={applyAvatar}
                                className={animationClass}
                            >
                                {isApplied ? <CheckCircleSharpIcon fontSize={"large"}/> :
                                    <FileDownloadDoneSharpIcon fontSize={"large"}/>}
                            </IconButton>
                        </Tooltip>
                        <Typography variant="subtitle1">{gimmick.name}</Typography>
                    </Box>
                </CardContent>
            </Card>
        </Grid>
    );
}

export default AvatarGimmick;