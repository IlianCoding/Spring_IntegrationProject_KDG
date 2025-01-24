import {useTranslation} from "react-i18next";
import {
    Box,
    Dialog,
    DialogContent,
    DialogTitle,
    Grid2 as Grid,
    IconButton,
    List,
    ListItem,
    ListItemText,
    Paper,
    Typography
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

interface InfoDialogProps {
    isOpen: boolean
    onClose: () => void
}

export function InfoDialog({isOpen, onClose}: InfoDialogProps) {
    const {t} = useTranslation()
    const roles = [
        {
            id: 1,
            name: "Assassin",
            ability: "The Assassin eliminates another character of your choice during the round, preventing them from taking any actions."
        },
        {
            id: 2,
            name: "Thief",
            ability: "The Thief steals all gold from another player of your choice, leaving them empty-handed."
        },
        {
            id: 3,
            name: "Magician",
            ability: "The Magician can exchange cards with the deck or trade hands with another player."
        },
        {
            id: 4,
            name: "King",
            ability: "The King collects income from yellow buildings and gets to choose the order of character selection next round."
        },
        {
            id: 5,
            name: "Bishop",
            ability: "The Bishop collects income from blue buildings and is immune to the Warlord’s attacks."
        },
        {
            id: 6,
            name: "Merchant",
            ability: "The Merchant earns extra gold and collects income from green buildings, making them a wealthy target."
        },
        {
            id: 7,
            name: "Architect",
            ability: "The Architect can draw extra cards and build up to three buildings during their turn."
        },
        {
            id: 8,
            name: "Warlord",
            ability: "The Warlord collects income from red buildings and can destroy one district by paying its cost."
        }
    ];
    const getRoleColor = (index: number) => {
        const colors = ['#e6e6fa', '#fffacd', '#e0ffff', '#ffdab9'];
        return colors[Math.floor(index / 2)];
    };
    return (
        <Dialog open={isOpen} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle sx={{m: 0, p: 2, bgcolor: '#f0e6d2',}}>
                {t("Game Rules")}
                <IconButton
                    onClick={onClose}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500],
                    }}
                >
                    <CloseIcon/>
                </IconButton>
            </DialogTitle>
            <DialogContent sx={{
                backgroundImage: 'url("https://img.freepik.com/free-photo/wooden-floor-background_53876-88628.jpg?t=st=1734941126~exp=1734944726~hmac=5ec16ce1beee4e0fb50a47948617b7327c054e72de79f6a07d167642eeb123d3&w=1380")',
                fontFamily: 'Courier New, Courier, monospace'
            }}>
                <Box sx={{display: 'flex', flexDirection: 'column', gap: 2, padding: 5}}>
                    <Paper elevation={3} sx={{p: 2, bgcolor: 'rgba(255, 255, 255, 0.7)'}}>
                        <Typography variant="h6" gutterBottom>{t("Course of a turn")}</Typography>
                        <List>
                            <ListItem>
                                <ListItemText
                                    primary={t("Incomefase: take 2 coins or draw cards in exchange for one of your own")}/>
                            </ListItem>
                            <ListItem>
                                <ListItemText primary={t("Buildfase: build 1 building and pay its cost")}/>
                            </ListItem>
                        </List>
                        <Box sx={{display: 'flex', justifyContent: 'space-between', mt: 2}}>
                            <Paper elevation={1} sx={{p: 1, flexBasis: '48%'}}>
                                <Typography variant="subtitle2">{t("Character ability:")}</Typography>
                                <Typography variant="body2">{t("Can be used at any moment.")}</Typography>
                            </Paper>
                        </Box>
                    </Paper>
                    <Paper elevation={3} sx={{p: 2, bgcolor: 'rgba(255, 255, 255, 0.7)'}}>
                        <Typography variant="h6" gutterBottom>{t("Characters")}</Typography>
                        <Grid container spacing={2}>
                            {roles.map((role, index) => (
                                <Grid size={{xs: 12, sm: 6}} key={role.id}>
                                    <Paper elevation={1} sx={{p: 1, bgcolor: getRoleColor(index)}}>
                                        <Typography variant="subtitle1">{role.id}. {t(role.name)}</Typography>
                                        <Typography variant="body2">{t(role.ability)}</Typography>
                                    </Paper>
                                </Grid>
                            ))}
                        </Grid>
                    </Paper>
                </Box>
            </DialogContent>
        </Dialog>
    )
}