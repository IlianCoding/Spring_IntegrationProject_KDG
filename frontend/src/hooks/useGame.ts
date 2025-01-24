import {getGameById, getGamesOfWeek, getLatestGameOfLobby, getOngoingGames} from '../services/gameService';
import {useMutation, useQuery} from '@tanstack/react-query';

export const useGetGame = (gameId: string) => {
    const {data, isLoading, isError} = useQuery({
        queryKey: ['game', gameId],
        queryFn: () => getGameById(gameId),
        enabled: !!gameId,
        refetchInterval: 5000
    });
    return {data, isLoading, isError};
};

export const useGetOngoingGames = (profileId: string) => {
    const {data, isLoading, isError} = useQuery({
        queryKey: ['ongoingGames', profileId],
        queryFn: () => getOngoingGames(profileId),
        enabled: !!profileId,
        refetchInterval: 30000
    });
    return {data, isLoading, isError};
};

export const useGetLatestGameOfLobby = () => {
    const {
        mutate,
        data,
        isPending,
        isError,
    } = useMutation(
        {
            mutationFn: (lobbyId: string) => getLatestGameOfLobby(lobbyId),
        });
    return {mutate, data, isPending, isError};
};

export const useGetLatestGameOfLobbyWithRefetch = (lobbyId: string) => {
    const {data, isLoading, isError} = useQuery({
        queryKey: ['latest-game-refetch', lobbyId],
        queryFn: () => getLatestGameOfLobby(lobbyId),
        enabled: !!lobbyId,
        refetchInterval: 5000
    });
    return {data, isLoading, isError};
};

export const useGetGamesOfWeek = (profileId: string) => {
    const {data, isLoading, isError} = useQuery({
        queryKey: ['gamesOfWeek', profileId],
        queryFn: () => getGamesOfWeek(profileId),
        enabled: !!profileId,
        refetchInterval: 30000
    });
    return {data, isLoading, isError};
};