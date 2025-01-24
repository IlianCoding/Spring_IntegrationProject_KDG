import useGameContext from "../../../../hooks/useGameContext.ts";
import {colors} from "../../../../model/constant/colors.ts";
import PlayerFrame from "./PlayerFrame.tsx";
import {Box, Typography} from "@mui/material";
import {useTranslation} from 'react-i18next';

function MainContentSection() {
    const {t} = useTranslation();
    const {game} = useGameContext();

    return (
        <Box className="main-content" sx={{padding: 2}}>
            <Box sx={{display: 'flex', flexWrap: 'wrap', gap: '16px'}}>
                {(!game || !game.playerStates) ? (
                    <Typography variant="h6" color="textSecondary">{t('Loading...')}</Typography>
                ) : (
                    game.playerStates?.slice()
                        .sort((a, b) => a.player.profile.name.localeCompare(b.player.profile.name))
                        .map((playerState, index) => (
                            <PlayerFrame
                                playerState={playerState}
                                color={colors[index % colors.length]}
                                key={playerState.player.profile.id}
                            />
                        ))
                )}
            </Box>
        </Box>
    );
}

export default MainContentSection;