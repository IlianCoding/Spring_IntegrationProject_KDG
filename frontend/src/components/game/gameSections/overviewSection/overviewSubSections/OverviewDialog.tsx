import {Dialog, DialogContent, DialogTitle, IconButton, Typography, useTheme} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import OverviewDialogPage from './OverviewDialogPage.tsx';
import './overviewDialog.css';
import {useTranslation} from 'react-i18next';

interface OverviewDialogProps {
    open: boolean;
    onClose: () => void;
}

function OverviewDialog({open, onClose}: OverviewDialogProps) {
    const {t} = useTranslation();
    const theme = useTheme();
    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullScreen
            disableEnforceFocus
            className="dialog-background dialog-enter"
            PaperProps={{
                style: {
                    backgroundColor: 'transparent',
                    boxShadow: 'none',
                },
            }}
        >
            <DialogTitle
                sx={{
                    textAlign: 'center',
                    backgroundColor: 'transparent',
                    padding: '20px',
                    borderRadius: '10px',
                    color: '#4B0082',
                    fontFamily: 'MedievalSharp, cursive',
                }}
            >
                <Typography sx={{opacity: 0, paddingBottom: '120px'}}></Typography>
                <IconButton
                    aria-label={t("close")}
                    onClick={onClose}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: theme.palette.grey[500],
                    }}
                >
                    <CloseIcon/>
                </IconButton>
            </DialogTitle>
            <DialogContent>
                <OverviewDialogPage/>
            </DialogContent>
        </Dialog>
    );
}

export default OverviewDialog;