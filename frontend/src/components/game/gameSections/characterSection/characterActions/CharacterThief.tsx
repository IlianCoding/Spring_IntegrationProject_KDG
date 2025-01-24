import useGameContext from "../../../../../hooks/useGameContext.ts";
import {useCharacterActionContext} from "../../../../../hooks/useCharacterActionContext.ts";
import {PlayerState} from "../../../../../model/game/PlayerState.ts";
import {Character} from "../../../../../model/game/character/Character.ts";
import {Box, Button, MenuItem, Select, Typography} from '@mui/material';
import {useTranslation} from 'react-i18next';

function CharacterThief() {
    const {t} = useTranslation();
    const {game, latestTurnByGameAndProfileData, characterActions} = useGameContext();
    const {setTargetPlayer, targetPlayer, handlePerformAction} = useCharacterActionContext();

    return (
        <Box className="character-action">
            <Typography variant="h6" className="character-title">{t('Target player to steal from:')}</Typography>
            <Select
                fullWidth
                displayEmpty
                onChange={(e) => setTargetPlayer(e.target.value ? JSON.parse(e.target.value) : null)}
                value={targetPlayer ? JSON.stringify(targetPlayer) : ''}
                variant={'outlined'}>
                <MenuItem value="">
                    <em>{t('Select Target Player')}</em>
                </MenuItem>
                {game?.playerStates
                    .filter((playerState: PlayerState) => !playerState.characters.some((character: Character) => character.number === 1 || character.number === 2))
                    .map((playerState: PlayerState) => (
                        <MenuItem key={playerState.player.id} value={JSON.stringify(playerState.player)}>
                            {playerState.player.profile.name}
                        </MenuItem>
                    ))}
            </Select>
            {targetPlayer && latestTurnByGameAndProfileData && game && (
                <Button
                    variant="contained"
                    color="primary"
                    className="character-button"
                    onClick={() => handlePerformAction(latestTurnByGameAndProfileData, game, characterActions)}
                >
                    {t('Perform Action')}
                </Button>
            )}
        </Box>
    );
}

export default CharacterThief;