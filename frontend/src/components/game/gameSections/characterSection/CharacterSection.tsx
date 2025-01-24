import {useContext, useEffect, useState} from 'react';
import {useCharacterActionContext} from "../../../../hooks/useCharacterActionContext.ts";
import {useTranslation} from "react-i18next";
import securityContext from "../../../../contexts/SecurityContext.ts";
import useGameContext from "../../../../hooks/useGameContext.ts";
import {useGetActiveGimmicks} from "../../../../hooks/useGimmickShop.ts";
import useHoverEffect from "../../../../hooks/CardEffects/useHoverEffect.ts";
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Divider,
    Tooltip,
    Typography
} from "@mui/material";
import {Character} from "../../../../model/game/character/Character.ts";
import characterImages from "../../../../model/game/character/CharacterImages.ts";
import CharacterActions from "./characterActions/CharacterActions.tsx";
import {playSoundBool} from "../../../utils/playSound.ts";
import {useGetCountOfAllTurnsFromRound} from "../../../../hooks/useRoundTurnActions.ts";

function CharacterSection() {
    const {t} = useTranslation();
    const {userId} = useContext(securityContext);
    const profileId = userId || '';
    const {latestTurnByGameAndProfileData, completedFases, isPlayersTurn, game} = useGameContext();
    const {data: turnCount} = useGetCountOfAllTurnsFromRound(latestTurnByGameAndProfileData?.round.id || '');
    const {
        selectedCharacter,
        setSelectedCharacter,
        setTargetPlayer,
        setTargetCharacter,
        setTargetBuilding,
        setBuildingsToExchange
    } = useCharacterActionContext();
    const [playedSounds, setPlayedSounds] = useState<Set<string>>(new Set());
    const [isPlaying, setIsPlaying] = useState(false);
    const [showDialog, setShowDialog] = useState(false);

    const handleCharacterClick = (characterId: string) => {
        const character = latestTurnByGameAndProfileData?.playerState.characters.find(c => c.id === characterId) || null;
        if (selectedCharacter?.id === characterId) {
            setSelectedCharacter(null);
            setTargetPlayer(null);
            setTargetCharacter(null);
            setTargetBuilding(null);
            setBuildingsToExchange([]);
        } else {
            setSelectedCharacter(character);
        }
    };

    useHoverEffect(['character-item-action']);

    const handleDialogClose = () => {
        setShowDialog(false);
    };
    const {data: activeGimmicks} = useGetActiveGimmicks(profileId);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (isPlayersTurn && latestTurnByGameAndProfileData && !showDialog && !isPlaying) {
                const charactersThatHavePlayed = latestTurnByGameAndProfileData?.playerState.charactersThatHavePlayed || [];
                const characters = latestTurnByGameAndProfileData?.playerState?.characters
                    .filter(char => !charactersThatHavePlayed.includes(char))
                    .sort((a: Character, b: Character) => a.number - b.number) || [];
                const activeCharacter = characters[0];
                if (activeCharacter && !playedSounds.has(activeCharacter.id) && activeGimmicks && !isPlaying) {
                    const gimmick = activeGimmicks.find(g => g.name.includes(activeCharacter.name));
                    if (gimmick && !isPlaying) {
                        playSoundBool(gimmick.name, setIsPlaying, isPlaying, setShowDialog);
                        setPlayedSounds(prev => new Set(prev).add(activeCharacter.id));
                    }
                }
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [isPlayersTurn, latestTurnByGameAndProfileData, activeGimmicks, showDialog, isPlaying, playedSounds, completedFases, turnCount, game?.playerStates]);

    useEffect(() => {
        setPlayedSounds(new Set());
    }, [latestTurnByGameAndProfileData?.round]);

    const filteredCharacters = latestTurnByGameAndProfileData?.playerState?.characters
        .filter((character: Character) => {
            if (latestTurnByGameAndProfileData?.round.fase === 'ACTIONFASE') {
                const charactersThatHavePlayed = latestTurnByGameAndProfileData?.playerState.charactersThatHavePlayed || [];
                const characters = latestTurnByGameAndProfileData?.playerState?.characters
                    .filter(char => !charactersThatHavePlayed.some(playedChar => playedChar.id === char.id))
                    .sort((a: Character, b: Character) => a.number - b.number) || [];
                const activeCharacter = characters[0];
                return character.id === activeCharacter?.id;
            }
            return true;
        });

    return (
        <Box className={`character-section ${!isPlayersTurn ? 'disabled' : ''}`} sx={{padding: 2}}>
            <Typography variant="h6" className={"player-action-title"} sx={{mb: '10px', textAlign: 'center'}}>
                {t('Character action')}
            </Typography>
            <Divider/>
            {showDialog && (
                <Dialog
                    open={showDialog}
                    onClose={handleDialogClose}
                    sx={{
                        '& .MuiDialog-paper': {
                            backgroundImage: 'url(\'https://img.freepik.com/free-photo/wooden-floor-background_53876-88628.jpg?t=st=1734941126~exp=1734944726~hmac=5ec16ce1beee4e0fb50a47948617b7327c054e72de79f6a07d167642eeb123d3&w=1380\')',
                            backgroundSize: '100% 110vh',
                            backgroundPosition: 'top',
                            backgroundRepeat: 'no-repeat',
                            backgroundAttachment: 'scroll',
                        }
                    }}
                >
                    <DialogTitle>{t('Playback Prevented')}</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            {t('Due to content policy, the character intro sound cannot be played automatically. Please click the button to play the character intro sound.')}
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button
                            sx={{
                                width: '200px',
                                backgroundSize: '300% 180%',
                                backgroundPosition: '0% 0%',
                            }}
                            onClick={handleDialogClose}
                        >
                            {t('OK')}
                        </Button>
                    </DialogActions>
                </Dialog>
            )}
            {filteredCharacters && filteredCharacters.length === 0 ? (
                <Typography variant="h6" sx={{textAlign: 'center', mt: 2}}>
                    {t("You have used your character ability already or it's not your turn")}
                </Typography>
            ) : (
                filteredCharacters && filteredCharacters.map((character: Character) => {
                    const characterName = t(character.name);
                    const tooltipTitle = isPlayersTurn && latestTurnByGameAndProfileData?.round.fase !== 'CHARACTERCHOICEFASE'
                        ? t("Use {{characterName}}'s ability? Click to use.", {characterName})
                        : t("Cannot use {{characterName}}'s ability outside your turn", {characterName});

                    return (
                        <Tooltip key={character.id} title={tooltipTitle}>
                            <Box
                                className={`character-item-action`}
                                sx={{
                                    cursor: isPlayersTurn && latestTurnByGameAndProfileData?.round.fase !== 'CHARACTERCHOICEFASE' ? 'url(\'/assets/Medieval-pointer-resized.cur\'), auto' : 'not-allowed',
                                    mt: '10px'
                                }}
                            >
                                <img
                                    src={characterImages[character.number]}
                                    alt={t(character.name)}
                                    onClick={() => isPlayersTurn && latestTurnByGameAndProfileData?.round.fase !== 'CHARACTERCHOICEFASE' && handleCharacterClick(character.id)}
                                    style={{
                                        pointerEvents: !isPlayersTurn || (completedFases && completedFases?.has(character.name)) ? 'none' : 'auto',
                                        height: '240px',
                                        width: '70%',
                                        objectFit: 'cover',
                                        objectPosition: 'center 30%',
                                        overflow: 'hidden',
                                        borderRadius: '10px'
                                    }}
                                />
                            </Box>
                        </Tooltip>
                    );
                })
            )}
            {selectedCharacter && (completedFases && !completedFases?.has(selectedCharacter.name)) && isPlayersTurn && latestTurnByGameAndProfileData?.round.fase !== 'CHARACTERCHOICEFASE' && (
                <CharacterActions/>
            )}
        </Box>
    );
}

export default CharacterSection;