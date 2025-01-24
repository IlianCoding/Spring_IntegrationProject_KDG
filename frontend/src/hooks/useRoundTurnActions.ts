import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {endTurn, getCountOfAllTurnsFromRound} from '../services/roundTurnService';

export const useEndTurn = () => {
    const queryClient = useQueryClient();
    const {mutate, isPending, isError} = useMutation({
        mutationFn: (turnId: string) => endTurn(turnId),
        onSuccess: (turnId) => {
            queryClient.invalidateQueries({queryKey: ['turn', turnId]});
            queryClient.invalidateQueries({queryKey: ['latestTurn']});
            queryClient.invalidateQueries({queryKey: ['latestTurnByGameAndProfile']});
            queryClient.invalidateQueries({queryKey: ['isPlayersTurn']});
            queryClient.invalidateQueries({queryKey: ['turnCount']});
        }
    });
    return {mutate, isPending, isError};
};

export const useGetCountOfAllTurnsFromRound = (roundId: string) => {
    const {data, isLoading, isError} = useQuery({
        queryKey: ['turnCount', roundId],
        queryFn: () => getCountOfAllTurnsFromRound(roundId),
        refetchInterval: 2000,
        enabled: !!roundId
    });

    return {data, isLoading, isError};
};