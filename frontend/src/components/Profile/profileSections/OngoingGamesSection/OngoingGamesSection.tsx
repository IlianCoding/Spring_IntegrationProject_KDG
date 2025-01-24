import {
    Alert,
    Avatar,
    Box,
    Button,
    CircularProgress,
    Grid2 as Grid,
    Table,
    TableBody,
    TableContainer,
    TableHead,
    Typography
} from '@mui/material';
import {useTranslation} from 'react-i18next';
import {useGetOngoingGames} from "../../../../hooks/useGame.ts";
import {useContext} from "react";
import {useNavigate} from 'react-router-dom';
import SecurityContext from "../../../../contexts/SecurityContext.ts";
import {StyledHeaderRow, StyledTableCell, StyledTableRow} from "../../../leaderboard/LeaderboardTableStylings.ts";

const OngoingGamesSection = () => {
    const {t} = useTranslation();
    const {userId} = useContext(SecurityContext);
    const profileId = userId || '';
    const {data: ongoingGames, isLoading, isError} = useGetOngoingGames(profileId);
    const navigate = useNavigate();

    return (
        <Box sx={{padding: 2, width: '100%', borderRadius: '4px'}} style={{
            background: 'url(\'https://img.freepik.com/free-photo/wooden-floor-background_53876-88628.jpg?t=st=1734941126~exp=1734944726~hmac=5ec16ce1beee4e0fb50a47948617b7327c054e72de79f6a07d167642eeb123d3&w=1380\')',
            backgroundSize: 'cover'
        }}>
            <Box sx={{padding: 2}}>
                <Typography variant="h5" align="center">{t('Ongoing games')}</Typography>
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
                            }}>{t('Turn of player')}</StyledTableCell>
                            <StyledTableCell sx={{
                                backgroundImage: 'url(\'https://img.freepik.com/free-photo/wooden-floor-background_53876-88628.jpg?t=st=1734941126~exp=1734944726~hmac=5ec16ce1beee4e0fb50a47948617b7327c054e72de79f6a07d167642eeb123d3&w=1380\')',
                                backgroundSize: 'cover'
                            }}>{t('Time left in turn')}</StyledTableCell>
                            <StyledTableCell sx={{
                                backgroundImage: 'url(\'https://img.freepik.com/free-photo/wooden-floor-background_53876-88628.jpg?t=st=1734941126~exp=1734944726~hmac=5ec16ce1beee4e0fb50a47948617b7327c054e72de79f6a07d167642eeb123d3&w=1380\')',
                                backgroundSize: 'cover'
                            }}>{t('Actions')}</StyledTableCell>
                        </StyledHeaderRow>
                    </TableHead>
                    <TableBody>
                        {isLoading ? (
                            <StyledTableRow>
                                <StyledTableCell colSpan={4} align="center">
                                    <CircularProgress/>
                                </StyledTableCell>
                            </StyledTableRow>
                        ) : isError ? (
                            <StyledTableRow>
                                <StyledTableCell colSpan={4} align="center">
                                    <Alert severity="error">
                                        <Typography fontFamily="MedievalSharp, cursive">
                                            {t('Failed to load ongoing games')}
                                        </Typography>
                                    </Alert>
                                </StyledTableCell>
                            </StyledTableRow>
                        ) : ongoingGames?.length === 0 ? (
                            <StyledTableRow>
                                <StyledTableCell colSpan={4} align="center">
                                    {t('You currently aren\'t in any games, try joining some!')}
                                </StyledTableCell>
                            </StyledTableRow>
                        ) : (
                            ongoingGames?.map(game => (
                                <StyledTableRow key={game.gameId}>
                                    <StyledTableCell>
                                        <Grid container spacing={2}>
                                            {game.players.map(player => (
                                                <Grid key={player.id} style={{display: 'flex', alignItems: 'center'}}>
                                                    <Avatar src={player.profile.avatarUrl}
                                                            alt={player.profile.userName}/>
                                                    <span style={{marginLeft: '8px'}}>{player.profile.userName}</span>
                                                </Grid>
                                            ))}
                                        </Grid>
                                    </StyledTableCell>
                                    <StyledTableCell>
                                        <Box style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                                            {game.playerWithCurrentTurn ? (
                                                <>
                                                    <Avatar src={game.playerWithCurrentTurn.profile.avatarUrl}
                                                            alt={game.playerWithCurrentTurn.profile.userName}/>
                                                    <span
                                                        style={{marginLeft: '8px'}}>{game.playerWithCurrentTurn.profile.userName}</span>
                                                </>
                                            ) : (
                                                <Typography>{t('None')}</Typography>
                                            )}
                                        </Box>
                                    </StyledTableCell>
                                    <StyledTableCell>
                                        <Box>
                                            {game.duration}
                                            <Typography variant="caption" display="block">
                                                ({t("refreshes every 30 seconds")})
                                            </Typography>
                                        </Box>
                                    </StyledTableCell>
                                    <StyledTableCell>
                                        <Box style={{display: 'flex', justifyContent: 'center'}}>
                                            <Button variant="contained" color="primary"
                                                    onClick={() => navigate(`/game/${game.gameId}`)}>
                                                {t('Go to Game')}
                                            </Button>
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

export default OngoingGamesSection;