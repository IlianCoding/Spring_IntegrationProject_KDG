import React, {useState} from 'react';
import {Box, IconButton, Menu, MenuItem, Typography} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';

interface NotificationButtonProps {
    channel: string;
}

function NotificationButton({channel}: NotificationButtonProps) {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        if (channel === 'DISCORD' || channel === 'MAIL') {
            // todo: setup discord or mail notifications
        } else {
            setAnchorEl(event.currentTarget);
        }
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <Box sx={{position: 'absolute', top: 0, right: 0}}>
            <IconButton onClick={handleClick}>
                <NotificationsIcon color={"primary"}/>
                <Typography color={"primary"} variant="caption">{channel || ''}</Typography>
            </IconButton>
            {channel !== 'DISCORD' && channel !== 'MAIL' && (
                <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                >
                    <MenuItem onClick={handleClose}>Notification 1</MenuItem>
                    <MenuItem onClick={handleClose}>Notification 2</MenuItem>
                    <MenuItem onClick={handleClose}>Notification 3</MenuItem>
                </Menu>
            )}
        </Box>
    );
}

export default NotificationButton;