import {
    Alert,
    Avatar,
    Box,
    CircularProgress,
    Grid2 as Grid,
    Table,
    TableBody,
    TableContainer,
    TableHead,
    Typography
} from '@mui/material';
import {useTranslation} from 'react-i18next';
import {useGetGamesOfWeek} from "../../../../hooks/useGame.ts";
import {useContext} from "react";
import SecurityContext from "../../../../contexts/SecurityContext.ts";
import {StyledHeaderRow, StyledTableCell, StyledTableRow} from "../../../leaderboard/LeaderboardTableStylings.ts";

const GamesOfWeekSection = () => {
    const {t} = useTranslation();
    const {userId} = useContext(SecurityContext);
    const profileId = userId || '';
    const {data: gamesOfWeek, isLoading, isError} = useGetGamesOfWeek(profileId);

    return (
        <Box sx={{padding: 2, width: '100%', borderRadius: '4px'}} style={{
            background: 'url(\'https://img.freepik.com/free-photo/wooden-floor-background_53876-88628.jpg?t=st=1734941126~exp=1734944726~hmac=5ec16ce1beee4e0fb50a47948617b7327c054e72de79f6a07d167642eeb123d3&w=1380\')',
            backgroundSize: 'cover'
        }}>
            <Box sx={{padding: 2}}>
                <Typography variant="h5" align="center">{t('Games of the Week')}</Typography>
            </Box>
            <TableContainer sx={{maxHeight: 300, overflowY: 'auto'}}>
                <Table stickyHeader>
                    <TableHead>
                        <StyledHeaderRow>
                            <StyledTableCell sx={{
                                backgroundImage: 'url(\'https://img.freepik.com/free-photo/wooden-floor-background_53876-88628.jpg?t=st=1734941126~exp=1734944726~hmac=5ec16ce1beee4e0fb50a47948617b7327c054e72de79f6a07d167642eeb123d3&w=1380\')',
                                backgroundSize: 'cover'
                            }}>{t('Players in game')}</StyledTableCell>
                            <StyledTableCell sx={{
                                backgroundImage: 'url(\'https://img.freepik.com/free-photo/wooden-floor-background_53876-88628.jpg?t=st=1734941126~exp=1734944726~hmac=5ec16ce1beee4e0fb50a47948617b7327c054e72de79f6a07d167642eeb123d3&w=1380\')',
                                backgroundSize: 'cover'
                            }}>{t('Winner')}</StyledTableCell>
                            <StyledTableCell sx={{
                                backgroundImage: 'url(\'https://img.freepik.com/free-photo/wooden-floor-background_53876-88628.jpg?t=st=1734941126~exp=1734944726~hmac=5ec16ce1beee4e0fb50a47948617b7327c054e72de79f6a07d167642eeb123d3&w=1380\')',
                                backgroundSize: 'cover'
                            }}>{t('End Time')}</StyledTableCell>
                        </StyledHeaderRow>
                    </TableHead>
                    <TableBody>
                        {isLoading ? (
                            <StyledTableRow>
                                <StyledTableCell colSpan={3} align="center">
                                    <CircularProgress/>
                                </StyledTableCell>
                            </StyledTableRow>
                        ) : isError ? (
                            <StyledTableRow>
                                <StyledTableCell colSpan={3} align="center">
                                    <Alert severity="error">
                                        <Typography fontFamily="MedievalSharp, cursive">
                                            {t('Failed to load games of the week')}
                                        </Typography>
                                    </Alert>
                                </StyledTableCell>
                            </StyledTableRow>
                        ) : gamesOfWeek?.length === 0 ? (
                            <StyledTableRow>
                                <StyledTableCell colSpan={3} align="center">
                                    {t('No games of the week available')}
                                </StyledTableCell>
                            </StyledTableRow>
                        ) : (
                            gamesOfWeek?.map(game => (
                                <StyledTableRow key={game.id}>
                                    <StyledTableCell>
                                        <Grid container spacing={2}>
                                            {game.playerStates.map(playerState => (
                                                <Grid key={playerState.player.id}
                                                      style={{display: 'flex', alignItems: 'center'}}>
                                                    <Avatar src={playerState.player.profile.avatarUrl}
                                                            alt={playerState.player.profile.userName}/>
                                                    <span
                                                        style={{marginLeft: '8px'}}>{playerState.player.profile.userName}</span>
                                                </Grid>
                                            ))}
                                        </Grid>
                                    </StyledTableCell>
                                    <StyledTableCell>
                                        <Box>
                                            {game.winner.profile.userName}
                                        </Box>
                                    </StyledTableCell>
                                    <StyledTableCell>
                                        <Box>
                                            {new Date(game.endTime).toLocaleString()}
                                        </Box>
                                    </StyledTableCell>
                                </StyledTableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default GamesOfWeekSection;