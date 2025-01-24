import {Box, MenuItem, Select, Typography} from '@mui/material';
import {useCharacterActionContext} from '../../../../../../hooks/useCharacterActionContext.ts';
import useGameContext from '../../../../../../hooks/useGameContext.ts';
import {useTranslation} from 'react-i18next';
import {Building} from "../../../../../../model/game/building/Building.ts";

function ExchangeAction() {
    const {t} = useTranslation();
    const {game, latestTurnByGameAndProfileData} = useGameContext();
    const {targetPlayer, setTargetPlayer, buildingsToExchange, setBuildingsToExchange} = useCharacterActionContext();

    return (
        <Box className="character-action">
            <Typography variant="h6"
                        className="character-title">{t('Target player to exchange deck with:')}</Typography>
            <Select
                fullWidth
                displayEmpty
                onChange={(e) => setTargetPlayer(e.target.value ? JSON.parse(e.target.value) : null)}
                value={targetPlayer ? JSON.stringify(targetPlayer) : ''}
                variant={'outlined'}
            >
                <MenuItem value="">
                    <em>{t('Select Target Player')}</em>
                </MenuItem>
                {game?.playerStates
                    .filter((playerState) => playerState.player.id !== latestTurnByGameAndProfileData?.playerState.player.id)
                    .map((playerState) => (
                        <MenuItem key={playerState.player.id} value={JSON.stringify(playerState.player)}>
                            {playerState.player.profile.name}
                        </MenuItem>
                    ))}
            </Select>
            {targetPlayer && (
                <>
                    <Typography variant="h6" className="character-title">{t('Buildings to exchange:')}</Typography>
                    <Select
                        multiple
                        fullWidth
                        displayEmpty
                        onChange={(e) => setBuildingsToExchange(Array.from(e.target.value as string[], value => JSON.parse(value)))}
                        value={buildingsToExchange.map(building => JSON.stringify(building))}
                        variant={'outlined'}
                    >
                        {game?.playerStates
                            .find(playerState => playerState.player.profile.id === targetPlayer.profile.id)
                            ?.buildingsInHand.map((building: Building) => (
                                <MenuItem key={building.id} value={JSON.stringify(building)}>
                                    {t(building.name)}
                                </MenuItem>
                            ))}
                    </Select>
                </>
            )}
        </Box>
    );
}

export default ExchangeAction;