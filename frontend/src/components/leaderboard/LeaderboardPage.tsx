import {useTranslation} from "react-i18next";
import React, {useContext, useState} from "react";
import {Box, Container, Paper, Tab, Table, TableBody, TableContainer, TableHead, Tabs, Typography} from "@mui/material";
import {
    CenteredSmallTableCell,
    CenteredTableCell,
    getTabLabel,
    StyledHeaderRow,
    StyledTableCell,
    StyledTableRow
} from "./LeaderboardTableStylings";
import {getTrophy} from "./LeaderboardTrophies.tsx";
import {useGetPersonalFriends, useGetPersonalScores, useGetTopPlayers} from "../../hooks/useLeaderboard.ts";
import SecurityContext from "../../contexts/SecurityContext.ts";
import {PlayerScore} from "../../model/leaderboard/PlayerScore.ts";

function LeaderboardPage() {
    const {t} = useTranslation();
    const {userId, isAuthenticated} = useContext(SecurityContext);
    const profileId = userId || '';
    const [tabIndex, setTabIndex] = useState(0);

    const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
        setTabIndex(newValue);
    };

    const {data: globalData, isLoading: isLoadingGlobal, isError: isErrorGlobal} = useGetTopPlayers();
    const {data: friendData, isLoading: isLoadingFriends, isError: isErrorFriends} = useGetPersonalFriends(profileId);
    const {
        data: personalData,
        isLoading: isLoadingPersonal,
        isError: isErrorPersonal
    } = useGetPersonalScores(profileId);

    const getData = () => {
        if (!isAuthenticated()) {
            return {data: globalData, isLoading: isLoadingGlobal, isError: isErrorGlobal};
        }
        switch (tabIndex) {
            case 0:
                return {data: globalData, isLoading: isLoadingGlobal, isError: isErrorGlobal};
            case 1:
                return {data: friendData, isLoading: isLoadingFriends, isError: isErrorFriends};
            case 2:
                return {data: personalData, isLoading: isLoadingPersonal, isError: isErrorPersonal};
            default:
                return {data: [], isLoading: false, isError: false};
        }
    };

    const {data, isLoading, isError} = getData();

    document.title = t('Leaderboard') + " - Machiavelli";

    return (
        <Container maxWidth="lg"
                   sx={{
                       backgroundImage: 'url(\'https://i.imgur.com/kRegqCk.jpeg\')',
                       backgroundSize: '100% 100%',
                       maxHeight: '800px',
                       borderRadius: '16px',
                       minHeight: '800px'
                   }}>
            <Box sx={{padding: 8}}>
                <Box sx={{
                    mb: 2,
                    backgroundImage: 'url(\'https://img.freepik.com/free-photo/wooden-floor-background_53876-88628.jpg?t=st=1734941126~exp=1734944726~hmac=5ec16ce1beee4e0fb50a47948617b7327c054e72de79f6a07d167642eeb123d3&w=1380\')',
                    backgroundSize: 'cover',
                    padding: '10px',
                    borderRadius: '8px',
                    color: '#4B0082',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <Typography variant="h4">
                        {getTabLabel(tabIndex, t)}
                    </Typography>
                    {isAuthenticated() && (
                        <Tabs value={tabIndex} onChange={handleTabChange}>
                            <Tab label={t('Global')}/>
                            <Tab label={t('Friends')}/>
                            <Tab label={t('Personal')}/>
                        </Tabs>
                    )}
                </Box>
                <TableContainer component={Paper} sx={{
                    maxHeight: 600,
                    backgroundImage: 'url(\'https://img.freepik.com/free-photo/wooden-floor-background_53876-88628.jpg?t=st=1734941126~exp=1734944726~hmac=5ec16ce1beee4e0fb50a47948617b7327c054e72de79f6a07d167642eeb123d3&w=1380\')',
                    backgroundSize: 'cover'
                }}>
                    <Table stickyHeader>
                        <TableHead>
                            <StyledHeaderRow>
                                <StyledTableCell
                                    sx={{
                                        backgroundImage: 'url(\'https://img.freepik.com/free-photo/wooden-floor-background_53876-88628.jpg?t=st=1734941126~exp=1734944726~hmac=5ec16ce1beee4e0fb50a47948617b7327c054e72de79f6a07d167642eeb123d3&w=1380\')',
                                        backgroundSize: 'cover'
                                    }}>{t('Rank')}</StyledTableCell>
                                <StyledTableCell
                                    sx={{
                                        backgroundImage: 'url(\'https://img.freepik.com/free-photo/wooden-floor-background_53876-88628.jpg?t=st=1734941126~exp=1734944726~hmac=5ec16ce1beee4e0fb50a47948617b7327c054e72de79f6a07d167642eeb123d3&w=1380\')',
                                        backgroundSize: 'cover'
                                    }}>{t('Username')}</StyledTableCell>
                                <StyledTableCell
                                    sx={{
                                        backgroundImage: 'url(\'https://img.freepik.com/free-photo/wooden-floor-background_53876-88628.jpg?t=st=1734941126~exp=1734944726~hmac=5ec16ce1beee4e0fb50a47948617b7327c054e72de79f6a07d167642eeb123d3&w=1380\')',
                                        backgroundSize: 'cover'
                                    }}>{t('Date won')}</StyledTableCell>
                                <StyledTableCell
                                    sx={{
                                        backgroundImage: 'url(\'https://img.freepik.com/free-photo/wooden-floor-background_53876-88628.jpg?t=st=1734941126~exp=1734944726~hmac=5ec16ce1beee4e0fb50a47948617b7327c054e72de79f6a07d167642eeb123d3&w=1380\')',
                                        backgroundSize: 'cover'
                                    }}>{t('Score')}</StyledTableCell>
                            </StyledHeaderRow>
                        </TableHead>
                        <TableBody>
                            {isLoading ? (
                                <StyledTableRow>
                                    <CenteredTableCell colSpan={4}>{t('Loading...')}</CenteredTableCell>
                                </StyledTableRow>
                            ) : isError ? (
                                <StyledTableRow>
                                    <CenteredTableCell colSpan={4}>{t('Error loading data')}</CenteredTableCell>
                                </StyledTableRow>
                            ) : data && data.length > 0 ? (
                                data.map((player: PlayerScore, index: number) => (
                                    <StyledTableRow key={player.playerId}>
                                        <CenteredSmallTableCell>{getTrophy(index + 1)}</CenteredSmallTableCell>
                                        <CenteredTableCell>{player.userName}</CenteredTableCell>
                                        <CenteredTableCell>{new Date(player.gameDate.replace(' ', 'T').split('.')[0]).toLocaleDateString('en-GB')}</CenteredTableCell>
                                        <CenteredSmallTableCell>{player.score}</CenteredSmallTableCell>
                                    </StyledTableRow>
                                ))
                            ) : (
                                <StyledTableRow>
                                    <CenteredTableCell colSpan={4}>{t('No data available')}</CenteredTableCell>
                                </StyledTableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
        </Container>
    );
}

export default LeaderboardPage;