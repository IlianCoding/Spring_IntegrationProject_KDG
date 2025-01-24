import {useAllCharacters} from "../../../../hooks/useAllCharacters.ts";
import {useState} from "react";
import {CharacterCard} from "./CharacterCard.tsx";
import {Box, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle} from "@mui/material";
import useGameContext from "../../../../hooks/useGameContext.ts";
import {useUpdateCharactersOfPlayerState} from "../../../../hooks/usePlayerStateActions.ts";
import {useCharacterDeckOfRound} from "../../../../hooks/useRoundActions.ts";
import {useTranslation} from 'react-i18next';

interface CharacterChoiceDialogProps {
    isOpen: boolean;
    onClose: () => void;
}

export function CharacterChoiceDialog({isOpen, onClose}: CharacterChoiceDialogProps) {
    const {t} = useTranslation();
    const {isError, characters} = useAllCharacters();
    const {
        latestTurnByGameAndProfileData: turn,
        round,
        isPlayersTurn
    } = useGameContext();
    const roundId = round?.id || '';
    const turnId = turn?.id || '';
    const {data: characterDeck, isLoading} = useCharacterDeckOfRound(roundId)
    const {mutate} = useUpdateCharactersOfPlayerState(turnId);
    const [chosen, setHasChosen] = useState<string | null>(null);
    if (isError || !characters) {
        return <Box>{t('Error... characters cannot be found')}</Box>
    }

    if ((!turn) || (!turn.playerState) || (!turn.playerState.player) || !isPlayersTurn || turn.round?.fase !== 'CHARACTERCHOICEFASE') {
        return null;
    }

    return (
        <Dialog open={isOpen} maxWidth='md' fullWidth>
            <DialogTitle sx={{fontWeight: 'bold', textAlign: 'center', mb: 1}}>
                {t('Choose Your Character')}
            </DialogTitle>
            <DialogContent dividers sx={{display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 3}}>
                {isLoading ? (
                    <CircularProgress/>
                ) : (
                    characterDeck?.characters.map((character) => (
                        <CharacterCard
                            character={character}
                            key={character.id}
                            chosen={chosen == character.id}
                            onClick={() => setHasChosen(character.id)}
                        />
                    ))
                )}
            </DialogContent>
            <DialogActions sx={{justifyContent: 'center', pb: 2}}>
                <Button
                    variant="contained"
                    color="primary"
                    disabled={!chosen}
                    onClick={() => {
                        if (chosen) {
                            mutate({
                                playerId: turn.playerState.player.id,
                                characterId: chosen,
                                roundId: turn?.round.id
                            });
                            onClose();
                        }
                    }}
                    sx={{
                        px: 4,
                        py: 1,
                        fontWeight: 'bold',
                        boxShadow: chosen ? '0 4px 8px rgba(0, 0, 0, 0.2)' : 'none'
                    }}
                >
                    {t('I have chosen')}
                </Button>
            </DialogActions>
        </Dialog>
    )
}