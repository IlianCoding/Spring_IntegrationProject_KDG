import {useQuery} from '@tanstack/react-query';
import {getPersonalFriends, getPersonalScores, getTopPlayers} from '../services/leaderboardService';

export const useGetTopPlayers = () => {
    const {data, isLoading, isError} = useQuery({
        queryKey: ['topPlayers'],
        queryFn: getTopPlayers,
        refetchInterval: 60000
    });
    return {data, isLoading, isError};
};

export const useGetPersonalScores = (profileId: string) => {
    const {data, isLoading, isError} = useQuery({
        queryKey: ['personalScores', profileId],
        queryFn: () => getPersonalScores(profileId),
        enabled: !!profileId,
        refetchInterval: 60000
    });
    return {data, isLoading, isError};
};

export const useGetPersonalFriends = (profileId: string) => {
    const {data, isLoading, isError} = useQuery({
        queryKey: ['personalFriends', profileId],
        queryFn: () => getPersonalFriends(profileId),
        enabled: !!profileId,
        refetchInterval: 60000
    });
    return {data, isLoading, isError};
};