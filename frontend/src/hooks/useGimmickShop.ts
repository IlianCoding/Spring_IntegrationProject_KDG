import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {
    getActiveGimmicks,
    getGimmick,
    getGimmicks,
    getGimmicksOfPlayer,
    purchaseGimmick
} from '../services/shopService';

export const useGetGimmick = (gimmickId: string) => {
    const {data, isLoading, isError} = useQuery({
        queryKey: ['gimmick', gimmickId],
        queryFn: () => getGimmick(gimmickId),
        enabled: !!gimmickId
    });
    return {data, isLoading, isError};
};

export const useGetGimmicks = () => {
    const {data, isLoading, isError} = useQuery({
        queryKey: ['gimmicks'],
        queryFn: getGimmicks
    });
    return {data, isLoading, isError};
};

export const useGetActiveGimmicks = (profileId: string) => {
    const {data, isLoading, isError} = useQuery({
        queryKey: ['activeGimmicks', profileId],
        queryFn: () => getActiveGimmicks(profileId),
        enabled: !!profileId,
        refetchInterval: 60000
    });
    return {data, isLoading, isError};
};

export const useGetGimmicksOfPlayer = (profileId: string) => {
    const {data, isLoading, isError} = useQuery({
        queryKey: ['gimmicksOfPlayer', profileId],
        queryFn: () => getGimmicksOfPlayer(profileId),
        enabled: !!profileId
    });
    return {data, isLoading, isError};
};

export const usePurchaseGimmick = (gimmickId: string, profileId: string, options?: { onSuccess?: () => void }) => {
    const queryClient = useQueryClient();
    const {mutate, data, isPending, isError} = useMutation({
        mutationFn: () => purchaseGimmick(gimmickId, profileId),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['gimmicksOfPlayer', profileId]});
            queryClient.invalidateQueries({queryKey: ['gimmick', gimmickId]});
            queryClient.invalidateQueries({queryKey: ['profile']});
            if (options?.onSuccess) {
                options.onSuccess();
            }
        }
    });
    return {mutate, data, isPending, isError};
};