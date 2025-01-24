import {useCharacterActionContext} from "../../../../../hooks/useCharacterActionContext.ts";
import useGameContext from "../../../../../hooks/useGameContext.ts";
import {Box, Button, Typography} from '@mui/material';
import {useTranslation} from 'react-i18next';

function CharacterKing() {
    const {t} = useTranslation();
    const {latestTurnByGameAndProfileData, game, characterActions} = useGameContext();
    const {handlePerformAction} = useCharacterActionContext();

    return (
        <Box className="character-action">
            <Typography variant="h6"
                        className="character-title">{t('King Action: Get 1 coin for each yellow building')}</Typography>
            {latestTurnByGameAndProfileData && game && (
                <Button
                    variant="contained"
                    color="primary"
                    className="character-button"
                    onClick={() => handlePerformAction(latestTurnByGameAndProfileData, game, characterActions)}
                >
                    {t('Perform King Action')}
                </Button>
            )}
        </Box>
    );
}

export default CharacterKing;