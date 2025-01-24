import {Box, Button, MenuItem, Select, Typography} from '@mui/material';
import ExchangeAction from './ExchangeAction.tsx';
import DrawAction from './DrawAction.tsx';
import useGameContext from '../../../../../../hooks/useGameContext.ts';
import {useCharacterActionContext} from "../../../../../../hooks/useCharacterActionContext.ts";
import {useTranslation} from 'react-i18next';

function CharacterMagician() {
    const {t} = useTranslation();
    const {game, latestTurnByGameAndProfileData, characterActions} = useGameContext();
    const {choice, setChoice, handlePerformAction, targetPlayer, buildingsToExchange} = useCharacterActionContext();

    return (
        <Box>
            <Typography variant="h6">{t('Action:')}</Typography>
            <Select
                fullWidth
                displayEmpty
                onChange={(e) => setChoice(e.target.value === 'exchange')}
                value={choice ? 'exchange' : 'draw'}
                variant={'outlined'}
            >
                <MenuItem value="exchange">{t('Exchange cards with a player')}</MenuItem>
                <MenuItem value="draw">{t('Put cards under the deck and draw new ones')}</MenuItem>
            </Select>
            {choice ? <ExchangeAction/> : <DrawAction/>}
            {(targetPlayer || buildingsToExchange.length > 0) && latestTurnByGameAndProfileData && game && (
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handlePerformAction(latestTurnByGameAndProfileData, game, characterActions)}
                >
                    {t('Perform Action')}
                </Button>
            )}
        </Box>
    );
}

export default CharacterMagician;