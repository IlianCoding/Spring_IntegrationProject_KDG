import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {
    buildBuilding,
    drawBuildings,
    getBuildingDeckSize,
    getCompletedFases,
    getLatestTurn,
    getLatestTurnByGameAndProfile,
    getRemainingCoinsInBank,
    getRemainingTime,
    isPlayersTurn,
    putBackBuilding,
    takeCoins
} from '../services/turnService';
import {Building} from '../model/game/building/Building.ts';

export const useTakeCoins = (turnId: string, amount: number, isCharacterAbility: boolean) => {
    const queryClient = useQueryClient();
    const {mutate, data, isPending, isError} = useMutation({
        mutationFn: () => takeCoins(turnId, amount, isCharacterAbility),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['turn', turnId]});
            queryClient.invalidateQueries({queryKey: ['remainingCoinsInBank', turnId]});
            queryClient.invalidateQueries({queryKey: ['completedFases', turnId]});
            queryClient.invalidateQueries({queryKey: ['latestTurn']});
            queryClient.invalidateQueries({queryKey: ['latestTurnByGameAndProfile']});
        }
    });
    return {mutate, data, isPending, isError};
};

export const useDrawBuildings = (turnId: string, amount: number, isCharacterAbility: boolean) => {
    const queryClient = useQueryClient();
    const {mutate, data, isPending, isError} = useMutation({
        mutationFn: () => drawBuildings(turnId, amount, isCharacterAbility),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['turn', turnId]})
            queryClient.invalidateQueries({queryKey: ['latestTurn']});
            queryClient.invalidateQueries({queryKey: ['completedFases', turnId]});
            queryClient.invalidateQueries({queryKey: ['buildingDeckSize', turnId]});
            queryClient.invalidateQueries({queryKey: ['latestTurnByGameAndProfile']});

        }

    });
    return {mutate, data, isPending, isError};
};

export const useBuildBuilding = (turnId: string) => {
    const queryClient = useQueryClient();
    const {mutate, data, isPending, isError} = useMutation({
        mutationFn: (buildingId: string) => buildBuilding(turnId, buildingId),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['remainingCoinsInBank', turnId]});
            queryClient.invalidateQueries({queryKey: ['turn', turnId]});
            queryClient.invalidateQueries({queryKey: ['latestTurn']});
            queryClient.invalidateQueries({queryKey: ['game']});
            queryClient.invalidateQueries({queryKey: ['latestTurnByGameAndProfile']});

        }
    });
    return {mutate, data, isPending, isError};
};

export const useGetRemainingCoinsInBank = (turnId: string) => {
    const {data, isLoading, isError} = useQuery({
        queryKey: ['remainingCoinsInBank', turnId],
        queryFn: () => getRemainingCoinsInBank(turnId),
        enabled: !!turnId,
        refetchInterval: 2000
    });
    return {data, isLoading, isError};
};

export const useGetBuildingDeckSize = (turnId: string) => {
    const {data, isLoading, isError} = useQuery({
        queryKey: ['buildingDeckSize', turnId],
        queryFn: () => getBuildingDeckSize(turnId),
        enabled: !!turnId,
        refetchInterval: 2000
    });
    return {data, isLoading, isError};
};

export const useGetCompletedFases = (turnId: string) => {
    const {data, isLoading, isError} = useQuery({
        queryKey: ['completedFases', turnId],
        queryFn: () => getCompletedFases(turnId),
        enabled: !!turnId,
        refetchInterval: 1000
    });
    return {data, isLoading, isError};
};

export const usePutBackBuilding = (turnId: string) => {
    const queryClient = useQueryClient();
    const {mutate, data, isPending, isError} = useMutation({
        mutationFn: (building: Building) => putBackBuilding(turnId, building),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['turn', turnId]})
            queryClient.invalidateQueries({queryKey: ['completedFases', turnId]});
            queryClient.invalidateQueries({queryKey: ['buildingDeckSize', turnId]});
            queryClient.invalidateQueries({queryKey: ['latestTurn']});
            queryClient.invalidateQueries({queryKey: ['latestTurnByGameAndProfile']});
        }
    });
    return {mutate, data, isPending, isError};
};

export const useGetRemainingTime = (turnId: string) => {
    const {data, isLoading, isError} = useQuery({
        queryKey: ['remainingTime', turnId],
        queryFn: () => getRemainingTime(turnId),
        enabled: !!turnId,
        refetchInterval: 10000
    });
    return {data, isLoading, isError};
};

export const useGetLatestTurn = (gameId: string) => {
    const {data, isLoading, isError} = useQuery({
        queryKey: ['latestTurn', gameId],
        queryFn: () => getLatestTurn(gameId),
        enabled: !!gameId,
        refetchInterval: 1000
    });
    return {data, isLoading, isError};
};

export const useGetLatestTurnByGameAndProfile = (gameId: string, profileId: string) => {
    const {data, isLoading, isError} = useQuery({
        queryKey: ['latestTurnByGameAndProfile', gameId, profileId],
        queryFn: () => getLatestTurnByGameAndProfile(gameId, profileId),
        enabled: !!gameId && !!profileId,
        refetchInterval: 1000
    });
    return {data, isLoading, isError};
};

export const useIsPlayersTurn = (gameId: string, profileId: string) => {
    const {data, isLoading, isError} = useQuery({
        queryKey: ['isPlayersTurn', gameId, profileId],
        queryFn: () => isPlayersTurn(gameId, profileId),
        enabled: !!gameId && !!profileId,
        refetchInterval: 1000
    });
    return {data, isLoading, isError};
};