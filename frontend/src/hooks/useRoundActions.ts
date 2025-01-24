import {useQuery} from "@tanstack/react-query";
import {getCharacterDeckOfRound} from "../services/roundService.ts";

export const useCharacterDeckOfRound = (roundId: string) => {
    const {data, isLoading, isError} = useQuery({
        queryKey: ['characterDeck', roundId],
        queryFn: () => getCharacterDeckOfRound(roundId),
        enabled: !!roundId,
        refetchInterval: 1000,
    });
    return {data, isLoading, isError}
}