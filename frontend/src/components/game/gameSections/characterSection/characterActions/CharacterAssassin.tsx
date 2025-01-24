import {useCharacterActionContext} from "../../../../../hooks/useCharacterActionContext.ts";
import useGameContext from "../../../../../hooks/useGameContext.ts";
import {Character} from "../../../../../model/game/character/Character.ts";
import {Box, Button, MenuItem, Select, Typography} from '@mui/material';
import {useTranslation} from 'react-i18next';

function CharacterAssassin() {
    const {t} = useTranslation();
    const {latestTurnByGameAndProfileData, game, characterActions} = useGameContext();
    const {
        setTargetCharacter, targetCharacter, handlePerformAction
    } = useCharacterActionContext();

    return (
        <Box className="character-action">
            <Typography variant="h6" className="character-title">{t('Target Character to murder:')}</Typography>
            <Select
                fullWidth
                displayEmpty
                onChange={(e) => setTargetCharacter(e.target.value ? JSON.parse(e.target.value) : null)}
                value={targetCharacter ? JSON.stringify(targetCharacter) : ''}
                variant={'outlined'}>
                <MenuItem value="">
                    <em>{t('Select Target Character')}</em>
                </MenuItem>
                {game?.playerStates
                    .flatMap((playerState) => playerState.characters)
                    .filter((character: Character) =>
                        character.number !== 5 &&
                        !latestTurnByGameAndProfileData?.playerState.characters.some((ownCharacter: Character) => ownCharacter.id === character.id)
                    )
                    .map((character: Character) => (
                        <MenuItem key={character.id} value={JSON.stringify(character)}>
                            {t(character.name)}
                        </MenuItem>
                    ))}
            </Select>
            {targetCharacter && latestTurnByGameAndProfileData && game && (
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

export default CharacterAssassin;