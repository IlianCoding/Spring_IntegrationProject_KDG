import {ReactNode, useContext, useState} from 'react';
import GameContext from './GameContext.ts';
import {useCharacterActions} from '../../hooks/useCharacterActions.ts';
import {
    useBuildBuilding,
    useDrawBuildings,
    useGetBuildingDeckSize,
    useGetCompletedFases,
    useGetLatestTurn,
    useGetLatestTurnByGameAndProfile,
    useGetRemainingCoinsInBank,
    useGetRemainingTime,
    useIsPlayersTurn,
    usePutBackBuilding,
    useTakeCoins
} from '../../hooks/useTurnActions.ts';
import {useGetGame} from '../../hooks/useGame.ts';
import securityContext from "../SecurityContext.ts";
import {useParams} from 'react-router-dom';
import {useEndTurn} from '../../hooks/useRoundTurnActions.ts';

interface GameContextProviderProps {
    children: ReactNode;
}

export const GameContextProvider = ({children}: GameContextProviderProps) => {
    const {gameId: parGameId} = useParams<{ gameId: string }>();
    const {data: game, isLoading: isLoadingGame, isError: isErrorGame} = useGetGame(parGameId || '');
    const gameId = game?.id || '';
    const {data: latestTurn, isLoading: isLoadingTurn, isError: isErrorTurn} = useGetLatestTurn(gameId);
    const turnId = latestTurn?.id || '';
    const {userId} = useContext(securityContext)
    const profileId = userId || '';

    const characterActions = useCharacterActions();
    const endTurn = useEndTurn();
    const getRemainingCoinsInBank = useGetRemainingCoinsInBank(turnId);
    const getBuildingDeckSize = useGetBuildingDeckSize(turnId);
    const getCompletedFases = useGetCompletedFases(turnId);

    const [amountOfCoinsToTake, setAmountOfCoinsToTake] = useState(2);
    const [amountOfBuildingsToTake, setAmountOfBuildingsToTake] = useState(2);
    const [isCharacterAbility, setIsCharacterAbility] = useState(false);

    const takeCoins = useTakeCoins(turnId, amountOfCoinsToTake, isCharacterAbility);
    const drawBuildings = useDrawBuildings(turnId, amountOfBuildingsToTake, isCharacterAbility);
    const buildBuilding = useBuildBuilding(turnId);
    const putBackBuilding = usePutBackBuilding(turnId);
    const remainingTimeHook = useGetRemainingTime(turnId);
    const latestTurnByGameAndProfile = useGetLatestTurnByGameAndProfile(gameId, profileId);
    const isPlayersTurnHook = useIsPlayersTurn(gameId, profileId);
    const coinsInBank = getRemainingCoinsInBank.data
    const buildingDeckSize = getBuildingDeckSize.data
    const completedFases = getCompletedFases.data
    const remainingTime = remainingTimeHook.data
    const latestTurnByGameAndProfileData = latestTurnByGameAndProfile.data
    const isPlayersTurn = isPlayersTurnHook.data || false;

    return (
        <GameContext.Provider value={{
            characterActions,
            endTurn,
            getRemainingCoinsInBank,
            getBuildingDeckSize,
            getCompletedFases,
            takeCoins,
            drawBuildings,
            buildBuilding,
            putBackBuilding,
            game,
            round: latestTurn?.round,
            isLoadingGame,
            isErrorGame,
            isLoadingTurn,
            isErrorTurn,
            isLoadingRound: isLoadingTurn,
            amountOfCoinsToTake,
            setAmountOfCoinsToTake,
            amountOfBuildingsToTake,
            setAmountOfBuildingsToTake,
            isCharacterAbility,
            setIsCharacterAbility,
            coinsInBank,
            buildingDeckSize,
            completedFases,
            isPlayersTurn,
            remainingTime,
            latestTurn,
            latestTurnByGameAndProfileData
        }}>
            {children}
        </GameContext.Provider>
    );
};