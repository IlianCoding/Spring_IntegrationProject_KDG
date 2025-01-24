import {useQuery} from '@tanstack/react-query';
import {canPerformMercenaryAction} from '../services/characterActionService';

export const useCanPerformMercenaryAction = (executivePlayerId: string, targetBuildingId: string) => {
    const {data, isLoading, isError} = useQuery({
        queryKey: ['canPerformMercenaryAction', executivePlayerId, targetBuildingId],
        queryFn: () => canPerformMercenaryAction(executivePlayerId, targetBuildingId),
        enabled: !!executivePlayerId && !!targetBuildingId
    });

    return {data, isLoading, isError};
};