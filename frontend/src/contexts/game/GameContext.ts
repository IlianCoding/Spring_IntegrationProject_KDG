import {createContext} from 'react';
import {UseMutateFunction, UseMutationResult} from '@tanstack/react-query';
import {Game} from '../../model/game/Game.ts';
import {Turn} from '../../model/game/Turn.ts';
import {Round} from '../../model/game/Round.ts';
import {Action} from '../../model/game/character/Action.ts';
import {PlayerState} from '../../model/game/PlayerState.ts';
import {Building} from '../../model/game/building/Building.ts';

interface GameContextProps {
    characterActions: UseMutationResult<PlayerState, Error, Action, unknown>;
    endTurn: {
        mutate: UseMutateFunction<void, Error, string, unknown>;
        isPending: boolean;
        isError: boolean;
    };
    getRemainingCoinsInBank: {
        data: number | undefined;
        isLoading: boolean;
        isError: boolean;
    };
    getBuildingDeckSize: {
        data: number | undefined;
        isLoading: boolean;
        isError: boolean;
    };
    getCompletedFases: {
        data: Set<string> | undefined;
        isLoading: boolean;
        isError: boolean;
    };
    takeCoins: {
        mutate: UseMutateFunction<Turn, Error, void, unknown>;
        data: Turn | undefined;
        isPending: boolean;
        isError: boolean;
    };
    drawBuildings: {
        mutate: UseMutateFunction<Building[], Error, void, unknown>;
        data: Building[] | undefined;
        isPending: boolean;
        isError: boolean;
    };
    buildBuilding: {
        mutate: UseMutateFunction<Turn, Error, string, unknown>;
        data: Turn | undefined;
        isPending: boolean;
        isError: boolean;
    };
    putBackBuilding: {
        mutate: UseMutateFunction<Turn, Error, Building, unknown>;
        data: Turn | undefined;
        isPending: boolean;
        isError: boolean;
    };
    game: Game | undefined;
    round: Round | undefined;
    isLoadingGame: boolean;
    isErrorGame: boolean;
    isLoadingTurn: boolean;
    isErrorTurn: boolean;
    isLoadingRound: boolean;
    amountOfCoinsToTake: number;
    setAmountOfCoinsToTake: (value: number) => void;
    amountOfBuildingsToTake: number;
    setAmountOfBuildingsToTake: (value: number) => void;
    isCharacterAbility: boolean;
    setIsCharacterAbility: (value: boolean) => void;
    coinsInBank: number | undefined;
    buildingDeckSize: number | undefined;
    completedFases: Set<string> | undefined
    isPlayersTurn: boolean;
    remainingTime: number | undefined;
    latestTurn: Turn | undefined;
    latestTurnByGameAndProfileData: Turn | undefined;
}

const GameContext = createContext<GameContextProps | null>(null);


export default GameContext;