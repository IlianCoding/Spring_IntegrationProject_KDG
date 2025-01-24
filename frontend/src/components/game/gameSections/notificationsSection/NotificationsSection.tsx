import {Box, Divider, Typography} from '@mui/material';
import useGameContext from "../../../../hooks/useGameContext.ts";
import {useTranslation} from 'react-i18next';

function NotificationsSection() {
    const {t} = useTranslation();
    const {latestTurn} = useGameContext();

    const notifications = [
        ...latestTurn?.playerState.notification ? [latestTurn.playerState.notification] : [],
        ...latestTurn?.notification ? [latestTurn.notification] : []
    ];

    const splitNotifications = notifications.flatMap(notification =>
        notification.split(/(?<=[.!?])\s+/)
    );

    return (
        <Box className={"notifications-container"}>
            <Typography variant="h6" className={"notifications-title"} sx={{mb: '10px', textAlign: 'center'}}>
                {t('Notifications')}
            </Typography>
            <Divider/>
            <Box className={"notifications"} sx={{maxHeight: '300px', overflowY: 'auto', padding: 2, borderRadius: 1}}>
                {splitNotifications.map((sentence, index) => (
                    <Typography
                        sx={{mb: '10px', fontSize: '1.2rem', color: '#4B0082'}}
                        key={index}
                        variant="body1"
                        component="p"
                    >
                        {sentence}
                    </Typography>
                ))}
            </Box>
        </Box>
    );
}

export default NotificationsSection;