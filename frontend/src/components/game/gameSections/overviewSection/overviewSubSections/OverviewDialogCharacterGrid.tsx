import {Avatar, Box, Grid2 as Grid, Tooltip, Typography} from '@mui/material';
import {PlayerState} from '../../../../../model/game/PlayerState.ts';
import useGameContext from "../../../../../hooks/useGameContext.ts";
import characterImages from '../../../../../model/game/character/CharacterImages.ts';
import useHoverEffect from "../../../../../hooks/CardEffects/useHoverEffect.ts";
import DraggableComponent from "../../DraggableComponent.tsx";
import CardType from "../../../../../model/enum/CardType.ts";
import {useTranslation} from 'react-i18next';

interface OverviewDialogCharacterGridProps {
    playerState: PlayerState;
    color: string;
}

function OverviewDialogCharacterGrid({playerState, color}: OverviewDialogCharacterGridProps) {
    const {t} = useTranslation();
    const player = playerState.player;
    const {latestTurn} = useGameContext();
    const isCurrentTurn = latestTurn?.playerState.player.profile.name === player.profile.name;
    const characterCount = playerState.characters?.length || 0;
    const imageSizeX = characterCount === 2 ? '160px' : '';
    const imageSizeY = characterCount === 2 ? '240px' : '';

    useHoverEffect(['building-item', 'character-item']);

    return (
        <Grid size={{xs: 12, md: 6, lg: 4}}>
            <Box className="card-container" sx={{
                border: `1px solid ${color}`,
                animation: isCurrentTurn ? 'glow 1s infinite' : 'none',
                '--glow-color': color
            }}>
                <Box className="card-header">
                    <Avatar src={player.profile.avatarUrl} alt={player.profile.userName} className="avatar"/>
                    <Typography variant="h5" className="username">{player.profile.userName}</Typography>
                    {isCurrentTurn && <strong className="current-turn">&nbsp;({t("Taking their turn")})</strong>}
                    <Tooltip title={`${player.profile.userName} ${t("has")} ${playerState.numberOfCoins} ${t("gold")}`}>
                        <Box className="gold-icon-container">
                            <img
                                src={
                                    (playerState.numberOfCoins ?? 2) > 10
                                        ? "/assets/gold-chest.png"
                                        : (playerState.numberOfCoins ?? 2) >= 5
                                            ? "/assets/gold-pouch.png"
                                            : "/assets/gold-pile.png"
                                }
                                alt="Gold"
                                style={{width: '94px', height: '57px'}}
                            />
                            <Typography variant="body1" className="gold-amount">
                                {playerState.numberOfCoins}
                            </Typography>
                        </Box>
                    </Tooltip>
                </Box>
                <Box sx={{display: 'flex', gap: '8px', marginTop: '8px'}}>
                    <Box sx={{flexGrow: 1, display: 'flex', gap: '8px'}}>
                        <Box sx={{marginTop: '4px'}}>
                            <Typography className="buildings-built-text" variant="h5">
                                {playerState.buildingsBuilt.length === 0 ? t('Empty street') : `${playerState.buildingsBuilt.length} ${t("Building")}${playerState.buildingsBuilt.length > 1 ? t('s') : ''} ${t("built:")}`}
                            </Typography>
                            <Box className="buildings-container">
                                {playerState.buildingsBuilt.map((building, idx) => (
                                    <DraggableComponent key={idx} type={CardType.Building}
                                                        id={`${building.id + '' + idx}`}>
                                        <Tooltip title={t(building.name)}>
                                            <Box id={`${building.id + '' + idx}`} className="building-item">
                                                <img src={building.imgUrl} alt={t(building.name)}
                                                     style={{marginRight: '4px', width: '100px', height: '162px'}}/>
                                            </Box>
                                        </Tooltip>
                                    </DraggableComponent>
                                ))}
                            </Box>
                        </Box>
                    </Box>
                    <Box className="character-container">
                        <Typography variant="h5" className="character-title">
                            {characterCount === 2 ? t('Characters:') : t('Character:')}
                        </Typography>
                        {playerState.characters?.map((character, idx) => (
                            <DraggableComponent key={idx} type={CardType.Character}
                                                id={`${character.id + '' + idx}`}>
                                <Tooltip title={t(character.name)}>
                                    <Box id={`${character.id + '' + idx}`} className="character-item">
                                        <img src={characterImages[character.number]} alt={t(character.name)}
                                             style={{width: imageSizeX, height: imageSizeY}}/>
                                    </Box>
                                </Tooltip>
                            </DraggableComponent>
                        )) || <Typography variant="body1">?</Typography>}
                    </Box>
                </Box>
            </Box>
        </Grid>
    );
}

export default OverviewDialogCharacterGrid;