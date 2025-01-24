import {Avatar, Box, Grid2 as Grid, Typography} from '@mui/material';
import {Achievement} from '../../../../model/profile/Achievement.ts';
import {useTranslation} from 'react-i18next';

interface AchievementItemProps {
    achievement: Achievement;
    isOwned: boolean;
}

function AchievementItem({achievement, isOwned}: AchievementItemProps) {
    const {t} = useTranslation();

    return (
        <Grid size={{xs: 12, sm: 6}}>
            <Box display="flex" alignItems="center" sx={{
                border: '2px solid #FFD700',
                borderRadius: '10px',
                padding: '10px',
                boxShadow: '0 0 10px rgba(0, 0, 0, 0.5)',
                transition: 'transform 0.3s, box-shadow 0.3s',
                '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 0 20px rgba(0, 0, 0, 0.7)'
                }
            }}>
                <Avatar sx={{
                    bgcolor: isOwned ? 'primary.main' : 'grey.500',
                    mr: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center',
                    fontSize: '1.6rem',
                    width: 38,
                    height: 38
                }}>
                    {isOwned ? '🏆' : '🔒'}
                </Avatar>
                <Box>
                    <Typography>{t(achievement.name)}</Typography>
                    <Typography variant="body2">{t(achievement.description)}</Typography>
                </Box>
            </Box>
        </Grid>
    );
}

export default AchievementItem;