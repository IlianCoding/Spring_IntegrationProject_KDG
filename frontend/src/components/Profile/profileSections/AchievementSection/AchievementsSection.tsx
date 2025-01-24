import {Box, Card, CardContent, Grid2 as Grid, Typography} from '@mui/material';
import {Achievement} from '../../../../model/profile/Achievement.ts';
import AchievementItem from './AchievementItem.tsx';
import {useTranslation} from 'react-i18next';

interface AchievementsSectionProps {
    sortedAchievements: Achievement[];
    profileAchievements: Achievement[];
}

function AchievementsSection({sortedAchievements, profileAchievements}: AchievementsSectionProps) {
    const {t} = useTranslation();

    return (
        <Card sx={{mb: 4}} className="achievements-section">
            <CardContent>
                <Typography variant="h5" color="textSecondary" mb={2}>{t('Achievements')}</Typography>
                <Box sx={{padding: 2, maxHeight: 352, overflowY: 'auto'}}>
                    <Grid container spacing={2}>
                        {sortedAchievements.map((achievement, index) => {
                            const isOwned = profileAchievements.some(userAchievement => userAchievement.id === achievement.id);
                            return (
                                <AchievementItem
                                    key={index}
                                    achievement={achievement}
                                    isOwned={isOwned}
                                />
                            );
                        })}
                    </Grid>
                </Box>
            </CardContent>
        </Card>
    );
}

export default AchievementsSection;