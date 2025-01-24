import {Box, MenuItem, Select, Typography} from '@mui/material';
import {useCharacterActionContext} from '../../../../../../hooks/useCharacterActionContext.ts';
import useGameContext from '../../../../../../hooks/useGameContext.ts';
import {useTranslation} from 'react-i18next';

function DrawAction() {
    const {t} = useTranslation();
    const {latestTurn} = useGameContext();
    const {buildingsToExchange, setBuildingsToExchange} = useCharacterActionContext();

    return (
        <Box className="character-action">
            <Typography variant="h6" className="character-title">{t('Cards to put into deck and replace:')}</Typography>
            <Select
                multiple
                fullWidth
                displayEmpty
                onChange={(e) => setBuildingsToExchange(Array.from(e.target.value as string[], value => JSON.parse(value)))}
                value={buildingsToExchange.map(building => JSON.stringify(building))}
                variant={'outlined'}>
                {latestTurn?.playerState.buildingsInHand.map((building) => (
                    <MenuItem key={building.id} value={JSON.stringify(building)}>
                        {t(building.name)}
                    </MenuItem>
                ))}
            </Select>
        </Box>
    );
}

export default DrawAction;