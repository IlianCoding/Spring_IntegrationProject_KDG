import {Box, CircularProgress, Grid2 as Grid} from '@mui/material';
import {PlayerState} from '../../../../../model/game/PlayerState.ts';
import useGameContext from '../../../../../hooks/useGameContext.ts';
import OverviewDialogCharacterGrid from './OverviewDialogCharacterGrid.tsx';
import {colors} from "../../../../../model/constant/colors.ts";

function OverviewDialogPage() {
    const {game} = useGameContext();

    return (
        <Box sx={{padding: '20px'}}>
            <Grid container spacing={2}>
                {(!game || !game.playerStates) ? (
                    <Grid size={{xs: 12}} sx={{textAlign: 'center', padding: '20px'}}>
                        <CircularProgress/>
                    </Grid>
                ) : (
                    game.playerStates
                        .slice()
                        .sort((a, b) => a.player.profile.name.localeCompare(b.player.profile.name))
                        .map((playerState: PlayerState, index: number) => (
                            <OverviewDialogCharacterGrid
                                key={playerState.player.profile.id}
                                playerState={playerState}
                                color={colors[index % colors.length]}
                            />
                        ))
                )}
            </Grid>
        </Box>
    );
}

export default OverviewDialogPage;