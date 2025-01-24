import {Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography} from '@mui/material';
import {PlayerState} from '../../../../../model/game/PlayerState.ts';
import useGameContext from "../../../../../hooks/useGameContext.ts";
import {useTranslation} from 'react-i18next';

function Scoreboard() {
    const {t} = useTranslation();
    const {game} = useGameContext();
    const playerStates: PlayerState[] = game?.playerStates || [];
    const sortedPlayers = [...playerStates].sort((a, b) => b.score - a.score);
    const winnerUserName = game?.winner.profile.userName || 'testusername';

    return (
        <Box sx={{padding: 2}}>
            <Typography variant="h4" gutterBottom sx={{fontFamily: 'MedievalSharp, cursive', color: '#4B0082'}}>
                {t('End Game Scoreboard')}
            </Typography>
            <TableContainer component={Paper} sx={{
                backgroundImage: 'url("https://img.freepik.com/free-photo/wooden-floor-background_53876-88628.jpg?t=st=1734941126~exp=1734944726~hmac=5ec16ce1beee4e0fb50a47948617b7327c054e72de79f6a07d167642eeb123d3&w=1380")',
                backgroundSize: 'cover',
                backgroundColor: 'rgba(0, 0, 0, 0.5)', // Adding a black transparency
                borderRadius: '8px',
                border: '2px solid #4B0082',
                maxWidth: '80%',
                margin: '0 auto'
            }}>
                <Table sx={{borderCollapse: 'collapse'}}>
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{
                                fontFamily: 'MedievalSharp, cursive',
                                color: '#4B0082',
                                fontWeight: 'bold',
                                border: '1px solid #4B0082'
                            }}>{t('Username')}</TableCell>
                            <TableCell align="center" sx={{
                                fontFamily: 'MedievalSharp, cursive',
                                color: '#4B0082',
                                fontWeight: 'bold',
                                border: '1px solid #4B0082'
                            }}>{t('Score')}</TableCell>
                            <TableCell align="center" sx={{
                                fontFamily: 'MedievalSharp, cursive',
                                color: '#4B0082',
                                fontWeight: 'bold',
                                border: '1px solid #4B0082'
                            }}>{t('Gold')}</TableCell>
                            <TableCell sx={{
                                fontFamily: 'MedievalSharp, cursive',
                                color: '#4B0082',
                                fontWeight: 'bold',
                                border: '1px solid #4B0082'
                            }}>{t('Buildings Built')}</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {sortedPlayers.map((playerState) => (
                            <TableRow key={playerState.id}>
                                <TableCell sx={{
                                    fontFamily: 'MedievalSharp, cursive',
                                    color: '#4B0082',
                                    border: '1px solid #4B0082'
                                }}>
                                    {playerState.player.profile.userName}
                                    {playerState.player.profile.userName === winnerUserName && (
                                        <Typography component="span" color="primary" sx={{marginLeft: 1}}>
                                            {t('(Winner!)')}
                                        </Typography>
                                    )}
                                </TableCell>
                                <TableCell align="center" sx={{
                                    fontFamily: 'MedievalSharp, cursive',
                                    color: '#4B0082',
                                    border: '1px solid #4B0082'
                                }}>{playerState.score}</TableCell>
                                <TableCell align="center" sx={{
                                    fontFamily: 'MedievalSharp, cursive',
                                    color: '#4B0082',
                                    border: '1px solid #4B0082'
                                }}>{playerState.numberOfCoins}</TableCell>
                                <TableCell sx={{
                                    fontFamily: 'MedievalSharp, cursive',
                                    color: '#4B0082',
                                    border: '1px solid #4B0082'
                                }}>
                                    {playerState.buildingsBuilt.map((building, index) => (
                                        <Box key={index}>{t(building.name)}</Box>
                                    ))}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
}

export default Scoreboard;