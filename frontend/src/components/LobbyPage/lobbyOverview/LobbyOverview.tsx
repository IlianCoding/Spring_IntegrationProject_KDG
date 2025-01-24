import {useAddPlayer, useGetAllOpenLobbies, useGetAutomaticallyJoinedLobby} from "../../../hooks/useLobbyActions.ts";
import {
    Alert,
    Avatar,
    Box,
    Button,
    CircularProgress,
    Container,
    Grid2 as Grid,
    Snackbar,
    Table,
    TableBody,
    TableContainer,
    TableHead,
    Typography
} from "@mui/material";
import {useTranslation} from "react-i18next";
import {useNavigate} from "react-router-dom";
import {useContext, useEffect, useState} from "react";
import SecurityContext from "../../../contexts/SecurityContext.ts";
import {
    CenteredTableCell,
    StyledHeaderRow,
    StyledTableCell,
    StyledTableRow
} from "../../leaderboard/LeaderboardTableStylings.ts";

export function LobbyOverview() {
    const {t} = useTranslation();
    const {data: openLobbies, isLoading: isLoadingOpenLobbies, isError: isErrorOpenLobbies} = useGetAllOpenLobbies();
    const {userId} = useContext(SecurityContext);
    const profileId = userId || '';
    const {
        mutate,
        data,
        isPending,
        isError: errorJoiningLobbies,
        isSuccess: isSuccesAuto
    } = useGetAutomaticallyJoinedLobby();
    const [lobbyId, setLobbyId] = useState<string>("");
    const navigate = useNavigate();
    const {mutate: addPlayer, isSuccess} = useAddPlayer();
    const [openSnackbar, setOpenSnackbar] = useState(false);

    const handleClickJoinLobby = (lobbyId: string, profileId: string) => {
        setLobbyId(lobbyId);
        addPlayer({lobbyId, profileId});
    };

    const handleClickJoinAutomatically = (profileId: string) => {
        mutate(profileId);
    };

    useEffect(() => {
        if (isSuccess) {
            navigate(`/lobby/${lobbyId}`);
        }
    }, [isSuccess, lobbyId, navigate]);

    useEffect(() => {
        if (data && isSuccesAuto) {
            navigate(`/lobby/${data.id}`);
        }
    }, [isSuccesAuto, data, navigate]);

    useEffect(() => {
        if (errorJoiningLobbies) {
            setOpenSnackbar(true);
        }
    }, [errorJoiningLobbies]);

    if (isErrorOpenLobbies) {
        return <Alert severity="error">{t("Error finding lobby")}</Alert>;
    }
    if (isPending || !openLobbies || isLoadingOpenLobbies) {
        return <CircularProgress/>;
    }

    return (
        <Container maxWidth="lg">
            <Box sx={{padding: 2, width: '100%', borderRadius: '4px'}} style={{
                background: 'url(\'https://img.freepik.com/free-photo/wooden-floor-background_53876-88628.jpg?t=st=1734941126~exp=1734944726~hmac=5ec16ce1beee4e0fb50a47948617b7327c054e72de79f6a07d167642eeb123d3&w=1380\')',
                backgroundSize: 'cover'
            }}>
                <Box sx={{padding: 2}}>
                    <Typography variant="h3" align="center">{t('Open Lobbies')}</Typography>
                </Box>
                <TableContainer sx={{maxHeight: 600, overflowY: 'auto'}}>
                    <Table stickyHeader>
                        <TableHead>
                            <StyledHeaderRow>
                                <StyledTableCell sx={{
                                    backgroundImage: 'url(\'https://img.freepik.com/free-photo/wooden-floor-background_53876-88628.jpg?t=st=1734941126~exp=1734944726~hmac=5ec16ce1beee4e0fb50a47948617b7327c054e72de79f6a07d167642eeb123d3&w=1380\')',
                                    backgroundSize: 'cover'
                                }}>{t('Number of players')}</StyledTableCell>
                                <StyledTableCell sx={{
                                    backgroundImage: 'url(\'https://img.freepik.com/free-photo/wooden-floor-background_53876-88628.jpg?t=st=1734941126~exp=1734944726~hmac=5ec16ce1beee4e0fb50a47948617b7327c054e72de79f6a07d167642eeb123d3&w=1380\')',
                                    backgroundSize: 'cover'
                                }}>{t('Players')}</StyledTableCell>
                                <StyledTableCell sx={{
                                    backgroundImage: 'url(\'https://img.freepik.com/free-photo/wooden-floor-background_53876-88628.jpg?t=st=1734941126~exp=1734944726~hmac=5ec16ce1beee4e0fb50a47948617b7327c054e72de79f6a07d167642eeb123d3&w=1380\')',
                                    backgroundSize: 'cover'
                                }} align="right">{t('Average Loyalty Points')}</StyledTableCell>
                                <StyledTableCell sx={{
                                    backgroundImage: 'url(\'https://img.freepik.com/free-photo/wooden-floor-background_53876-88628.jpg?t=st=1734941126~exp=1734944726~hmac=5ec16ce1beee4e0fb50a47948617b7327c054e72de79f6a07d167642eeb123d3&w=1380\')',
                                    backgroundSize: 'cover'
                                }} align="right">{t('Actions')}</StyledTableCell>
                            </StyledHeaderRow>
                        </TableHead>
                        <TableBody>
                            {openLobbies.map((lobby) => {
                                const isPlayerInLobby = lobby.profiles.some(profile => profile.id === profileId);
                                if (lobby.profiles.length >= 7) return null;
                                return (
                                    <StyledTableRow key={lobby.id}>
                                        <CenteredTableCell>{lobby.profiles.length}</CenteredTableCell>
                                        <StyledTableCell>
                                            <Grid container spacing={2}>
                                                {lobby.profiles.map(profile => (
                                                    <Grid
                                                        key={profile.id}
                                                        component="div"
                                                        sx={{display: 'flex', alignItems: 'center', pr: 2}}
                                                    >
                                                        <Avatar src={profile.avatarUrl} alt={profile.userName}/>
                                                        <span style={{marginLeft: '8px'}}>{profile.userName}</span>
                                                    </Grid>
                                                ))}
                                            </Grid>
                                        </StyledTableCell>
                                        <CenteredTableCell
                                            align="right">{lobby.averageLoyaltyPoints}</CenteredTableCell>
                                        <StyledTableCell align="right">
                                            <Box style={{display: 'flex', justifyContent: 'center'}}>
                                                {isPlayerInLobby ? (
                                                    <Button variant="contained" color="primary"
                                                            onClick={() => navigate(`/lobby/${lobby.id}`)}>
                                                        {t('Go to lobby')}
                                                    </Button>
                                                ) : (
                                                    <Button variant="contained" color="primary"
                                                            onClick={() => handleClickJoinLobby(lobby.id, profileId)}>
                                                        {t('Join lobby')}
                                                    </Button>
                                                )}
                                            </Box>
                                        </StyledTableCell>
                                    </StyledTableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
                <Box sx={{display: 'flex', justifyContent: 'center', marginTop: 2}}>
                    <Button variant="contained" color="primary" onClick={() => handleClickJoinAutomatically(profileId)}>
                        {t("Join automatically")}
                    </Button>
                </Box>
            </Box>
            <Snackbar
                open={openSnackbar}
                autoHideDuration={6000}
                onClose={() => setOpenSnackbar(false)}
                message={t("Couldn't find any lobbies matching your loyalty point level")}
                anchorOrigin={{vertical: 'top', horizontal: 'right'}}
                ContentProps={{
                    sx: {
                        backgroundColor: '#4B0082',
                        color: "white",
                        mt: 8
                    }
                }}
            />
        </Container>
    )
}