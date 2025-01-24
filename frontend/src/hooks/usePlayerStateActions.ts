import {useMutation, useQueryClient} from "@tanstack/react-query";
import {endTurn} from "../services/roundTurnService.ts";
import {putPlayerStateCharacters} from "../services/roundService.ts";

export const useUpdateCharactersOfPlayerState = (turnId: string) => {
    const queryClient = useQueryClient();

    const {
        mutate, isPending, isError
    } = useMutation(
        {
            mutationFn: ({playerId, characterId, roundId}: {
                playerId: string,
                characterId: string,
                roundId: string
            }) => putPlayerStateCharacters(playerId, characterId, roundId),
            onSuccess: async () => {
                await endTurn(turnId);
                await queryClient.invalidateQueries({queryKey: ["latestTurnByGameAndProfile"]});
                await queryClient.invalidateQueries({queryKey: ["latestTurn"]});
                await queryClient.invalidateQueries({queryKey: ["isPlayersTurn"]});
            },
        }
    );

    return {
        mutate, isPending, isError
    };
}