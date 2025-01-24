import {useEffect, useRef, useState} from 'react';
import {Box, IconButton, Tooltip} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import OverviewDialog from './overviewSubSections/OverviewDialog.tsx';
import {useTranslation} from 'react-i18next';

function OverviewSection() {
    const {t} = useTranslation();
    const [open, setOpen] = useState(false);
    const buttonRef = useRef<HTMLButtonElement>(null);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        if (buttonRef.current) {
            buttonRef.current.blur();
        }
    };

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Tab') {
                event.preventDefault();
                if (open && buttonRef.current) {
                    setOpen(false);
                } else {
                    setOpen(true);
                }
            } else if (event.key === 'Escape') {
                handleClose();
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [open]);

    return (
        <Box className="overview">
            <Tooltip title={t("Show overview (TAB to open)")}>
                <IconButton
                    sx={{color: '#4B0082'}}
                    onClick={handleClickOpen}
                    ref={buttonRef}
                    component="button"
                    disabled={open}
                >
                    <VisibilityIcon fontSize="large"/>
                </IconButton>
            </Tooltip>
            <OverviewDialog open={open} onClose={handleClose}/>
        </Box>
    );
}

export default OverviewSection;