import {Box, Button, MenuItem, Select, Typography} from '@mui/material';
import useGameContext from '../../../../../hooks/useGameContext.ts';
import {useCharacterActionContext} from '../../../../../hooks/useCharacterActionContext.ts';
import {useCanPerformMercenaryAction} from "../../../../../hooks/useCharacterActionsChecker.ts";
import {useTranslation} from 'react-i18next';
import {PlayerState} from "../../../../../model/game/PlayerState.ts";

function CharacterWarlord() {
    const {t} = useTranslation();
    const {game, latestTurnByGameAndProfileData, characterActions} = useGameContext();
    const {
        targetPlayer,
        setTargetPlayer,
        setTargetBuilding,
        targetBuilding,
        handlePerformAction
    } = useCharacterActionContext();
    const executivePlayerId = latestTurnByGameAndProfileData?.playerState.player.id || '';
    const {data: canPerformAction} = useCanPerformMercenaryAction(executivePlayerId, targetBuilding?.id || '');
    const currentPlayerId = latestTurnByGameAndProfileData?.playerState.player.id;

    const targetPlayerState = game?.playerStates.find(ps => ps.player.id === targetPlayer?.id);

    return (
        <Box className="character-action">
            <Typography variant="h6"
                        className="character-title">{t('Target player to destroy building from:')}</Typography>
            <Select
                fullWidth
                displayEmpty
                onChange={(e) => setTargetPlayer(e.target.value ? JSON.parse(e.target.value) : null)}
                value={targetPlayer ? JSON.stringify(targetPlayer) : ''}
                variant="outlined"
            >
                <MenuItem value="">
                    <em>{t('Select Target Player')}</em>
                </MenuItem>
                {game?.playerStates
                    .filter((playerState: PlayerState) => playerState.player.id !== currentPlayerId)
                    .map((playerState: PlayerState) => (
                        <MenuItem key={playerState.player.id} value={JSON.stringify(playerState.player)}>
                            {playerState.player.profile.name}
                        </MenuItem>
                    ))}
            </Select>
            {targetPlayer && (
                <>
                    <Typography variant="h6" className="character-title"
                                sx={{mt: 2}}>{t('Target Building to destroy:')}</Typography>
                    <Select
                        fullWidth
                        displayEmpty
                        onChange={(e) => setTargetBuilding(e.target.value ? JSON.parse(e.target.value) : null)}
                        value={targetBuilding ? JSON.stringify(targetBuilding) : ''}
                        variant="outlined"
                    >
                        <MenuItem value="">
                            <em>{t('Select Target Building')}</em>
                        </MenuItem>
                        {targetPlayerState && targetPlayerState.buildingsBuilt && targetPlayerState.buildingsBuilt.length > 0 ? (
                            targetPlayerState.buildingsBuilt.map((building) => (
                                <MenuItem key={building.id} value={JSON.stringify(building)}>
                                    {t(building.name)}
                                </MenuItem>
                            ))
                        ) : (
                            <MenuItem disabled>
                                {t('No buildings to target')}
                            </MenuItem>
                        )}
                    </Select>
                </>
            )}
            {targetPlayer && targetBuilding && latestTurnByGameAndProfileData && game && (
                <Button
                    variant="contained"
                    color="primary"
                    className="character-button"
                    onClick={() => handlePerformAction(latestTurnByGameAndProfileData, game, characterActions)}
                    disabled={!canPerformAction}
                    title={!canPerformAction ? t('Cannot perform action due to not having enough coins to destroy the targeted building') : ''}
                    sx={{mt: 2}}
                >
                    {t('Perform Action')}
                </Button>
            )}
        </Box>
    );
}

export default CharacterWarlord;