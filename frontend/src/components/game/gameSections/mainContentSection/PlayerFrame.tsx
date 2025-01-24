import {PlayerState} from "../../../../model/game/PlayerState.ts";
import {Box, Card, CardContent, Divider, Tooltip, Typography} from "@mui/material";
import useGameContext from "../../../../hooks/useGameContext.ts";
import useHoverEffect from "../../../../hooks/CardEffects/useHoverEffect.ts";
import {useTranslation} from 'react-i18next';
import './playerFrame.css';

interface PlayerFrameProps {
    playerState: PlayerState;
    color: string;
}

function PlayerFrame({playerState, color}: PlayerFrameProps) {
    const {t} = useTranslation();
    const player = playerState.player;
    const {latestTurn} = useGameContext();

    const isCurrentPlayerTurn = latestTurn?.playerState.player.profile.id === player.profile.id;
    useHoverEffect(['building-item-main']);

    return (
        <Card key={player.profile.id} className="frame" sx={{
            border: `4px solid ${color}`,
            width: '200px',
            maxWidth: 'calc(33.1695% - 16px)',
            marginBottom: 2,
            flex: '1 1 calc(33.333% - 16px)',
            boxSizing: 'border-box',
            animation: isCurrentPlayerTurn ? 'glow 1s infinite' : 'none',
            '--glow-color': color
        }}>
            <CardContent>
                <Typography gutterBottom className="player-name">
                    {player.profile.userName}
                </Typography>
                <Box className="placed-buildings-section">
                    {playerState.buildingsBuilt.length > 0 ? (
                        <>
                            <Divider sx={{marginY: 1}}/>
                            <Typography className="buildings-title" variant="h5">
                                {playerState.buildingsBuilt.length === 0 ? t('Empty street') : `${playerState.buildingsBuilt.length} ${t('Building')}${playerState.buildingsBuilt.length > 1 ? t('s') : ''} ${t('built:')}`}
                            </Typography>
                            <Box className="buildings" sx={{display: 'flex', gap: '8px', flexWrap: 'wrap'}}>
                                {playerState.buildingsBuilt.map((building, idx) => (
                                    <Tooltip key={building.id} title={t(building.name)}>
                                        <Box id={`${building.id + '' + idx}`} className="building-item-main">
                                            <img src={building.imgUrl} alt={t(building.name)}
                                                 style={{marginRight: '4px'}}/>
                                        </Box>
                                    </Tooltip>
                                ))}
                            </Box>
                        </>
                    ) : (
                        <Typography variant="body2">{t('This street is empty')}</Typography>
                    )}
                </Box>
            </CardContent>
        </Card>
    );
}

export default PlayerFrame;