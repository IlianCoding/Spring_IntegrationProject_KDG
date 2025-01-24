import {useMutation, useQueryClient} from '@tanstack/react-query';
import {performCharacterAction} from '../services/characterActionService';
import {Action} from '../model/game/character/Action.ts';

export const useCharacterActions = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (action: Action) => performCharacterAction(action),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['game']});
            queryClient.invalidateQueries({queryKey: ['remainingCoinsInBank']});
            queryClient.invalidateQueries({queryKey: ['completedFases']});
            queryClient.invalidateQueries({queryKey: ['latestTurn']});
            queryClient.invalidateQueries({queryKey: ['latestTurnByGameAndProfile']});
        }
    });
};