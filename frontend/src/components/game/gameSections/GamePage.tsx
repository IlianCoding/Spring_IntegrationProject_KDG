import {useEffect, useState} from 'react';
import './GameSections.css';
import {Building} from '../../../model/game/building/Building.ts';
import OverviewSection from './overviewSection/OverviewSection.tsx';
import MainContentSection from './mainContentSection/MainContentSection.tsx';
import CharacterSection from './characterSection/CharacterSection.tsx';
import CoinsHandBuildingsSection from './coinsHandBuildingsSection/CoinsHandBuildingsSection.tsx';
import NotificationsSection from './notificationsSection/NotificationsSection.tsx';
import PlayerStateSection from './playerStateSection/PlayerStateSection.tsx';
import TimeLeftSection from './timeLeftSection/TimeLeftSection.tsx';
import useGameContext from '../../../hooks/useGameContext.ts';
import {CharacterActionProvider} from "../../../contexts/game/CharacterActionContextProvider.tsx";
import {Box, Typography} from "@mui/material";
import {useParams} from "react-router-dom";
import {validate as isUuid} from 'uuid';
import {CharacterChoiceDialog} from './characterChoiceDialog/CharacterChoiceDialog.tsx';
import {useTranslation} from 'react-i18next';
import GameNotStarted from "./gameStates/GameNotStarted.tsx";
import LoadingGame from "./gameStates/LoadingGame.tsx";
import GameNotFound from "./gameStates/GameNotFound.tsx";
import GameEnded from "./gameStates/GameEnded.tsx";

function GamePage() {
    const {gameId} = useParams<{ gameId: string }>();
    const {t} = useTranslation();
    const [listDrawnBuildings, setListDrawnListDrawnBuildings] = useState<Building[]>([]);
    const [hasDrawnBuildings, setHasDrawnBuildings] = useState(false);
    const [buildingsPutBack, setBuildingsPutBack] = useState(false);
    const [canTakeCoins, setCanTakeCoins] = useState(false);
    const [canDrawBuildings, setCanDrawBuildings] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const {
        latestTurn,
        isLoadingGame,
        isErrorGame,
        latestTurnByGameAndProfileData,
        getRemainingCoinsInBank,
        getBuildingDeckSize,
        getCompletedFases,
        takeCoins,
        drawBuildings,
        buildBuilding,
        putBackBuilding,
        game,
        isPlayersTurn
    } = useGameContext();

    const {data: coinsInBank, isLoading: isLoadingCoins} = getRemainingCoinsInBank;
    const {data: completedFases, isLoading: isLoadingCompletedFases} = getCompletedFases;
    const {data: buildingDeckSize, isLoading: isLoadingBuildingDeckSize} = getBuildingDeckSize;
    const {mutate: executeTakeCoins} = takeCoins;
    const {data: drawnBuildings, isPending: isLoadingBuildings, mutate: executeDrawBuildings} = drawBuildings;
    const {mutate: executeBuildBuilding} = buildBuilding;
    const {mutate: executePutBackBuilding} = putBackBuilding;
    const currentPlayerName = latestTurn?.playerState.player.profile.userName;

    useEffect(() => {
        if (!isLoadingCoins && !isLoadingBuildingDeckSize && !isLoadingCompletedFases) {
            const isIncomePhaseCompleted = completedFases?.has('INCOMEFASE');
            const canTakeCoins = (coinsInBank ?? 0) >= 2 && !isIncomePhaseCompleted;
            const canDrawBuildings = (buildingDeckSize ?? 0) >= 2 && !isIncomePhaseCompleted;

            setCanTakeCoins(canTakeCoins && isPlayersTurn);
            setCanDrawBuildings(canDrawBuildings && isPlayersTurn);
        }
    }, [isLoadingCoins, isLoadingBuildingDeckSize, isLoadingCompletedFases, coinsInBank, buildingDeckSize, completedFases, isPlayersTurn]);

    useEffect(() => {
        if (hasDrawnBuildings && drawnBuildings && latestTurnByGameAndProfileData && !buildingsPutBack) {
            const isBuilder = latestTurnByGameAndProfileData.playerState.characters.some((character: {
                number: number
            }) => character.number === 7);
            if (!isBuilder) {
                setListDrawnListDrawnBuildings(drawnBuildings);
            }
            setHasDrawnBuildings(false);
        }
    }, [hasDrawnBuildings, drawnBuildings, buildingsPutBack, latestTurnByGameAndProfileData]);

    useEffect(() => {
        if (isPlayersTurn && latestTurnByGameAndProfileData?.round.fase === 'CHARACTERCHOICEFASE') {
            setIsDialogOpen(true);
        }
    }, [isPlayersTurn, latestTurnByGameAndProfileData]);

    const handleTakeCoins = () => {
        if (isPlayersTurn) {
            executeTakeCoins();
            setCanTakeCoins(false);
        }
    }

    const handleDrawBuildings = () => {
        if (isPlayersTurn) {
            executeDrawBuildings();
            setHasDrawnBuildings(true);
            setCanDrawBuildings(false);
        }
    }

    const handleBuildBuilding = (buildingId: string) => {
        if (isPlayersTurn) {
            executeBuildBuilding(buildingId);
        }
    }

    const handlePutBackBuilding = (building: Building) => {
        executePutBackBuilding(building);
        setListDrawnListDrawnBuildings([]);
        setBuildingsPutBack(true);
    }

    if (isLoadingGame) {
        return <LoadingGame/>;
    }

    if (!gameId || !isUuid(gameId) || isErrorGame) {
        return <GameNotFound/>;
    }

    if (game?.completed) {
        return <GameEnded/>;
    }

    if (game?.numberOfRounds === 0) {
        return <GameNotStarted/>;
    }

    return (
        <Box className="main-game-window">
            <CharacterChoiceDialog
                isOpen={isDialogOpen}
                onClose={() => setIsDialogOpen(false)}>
            </CharacterChoiceDialog>
            <Box style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                {currentPlayerName && (
                    <Typography className="turn-title-main" variant="h3" sx={{marginBottom: 2}}>
                        {latestTurn?.round.fase === 'CHARACTERCHOICEFASE'
                            ? `${currentPlayerName} ${t('is picking a character')}`
                            : `${currentPlayerName} ${t('\'s turn')}`}
                    </Typography>
                )}
            </Box>
            <Box className="container">
                <OverviewSection/>
                <MainContentSection/>
                <CharacterActionProvider>
                    <CharacterSection/>
                </CharacterActionProvider>
                <CoinsHandBuildingsSection
                    listDrawnBuildings={listDrawnBuildings}
                    handlePutBackBuilding={handlePutBackBuilding}
                    handleBuildBuilding={handleBuildBuilding}
                />
                <NotificationsSection/>
                <PlayerStateSection
                    canTakeCoins={canTakeCoins}
                    canDrawBuildings={canDrawBuildings}
                    isLoadingCoins={isLoadingCoins}
                    isLoadingBuildings={isLoadingBuildings}
                    completedFases={isLoadingCompletedFases ? new Set<string>() : completedFases}
                    handleTakeCoins={handleTakeCoins}
                    handleDrawBuildings={handleDrawBuildings}
                    listDrawnBuildings={listDrawnBuildings}
                />
                <TimeLeftSection/>
            </Box>
        </Box>
    )
}

export default GamePage;