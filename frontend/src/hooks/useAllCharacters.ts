import {useQuery} from "@tanstack/react-query";
import {getAllCharacters} from "../services/characterService.ts";

export function useAllCharacters() {
    const {isLoading, isError, data: characters} = useQuery({queryKey: [`characters`], queryFn: getAllCharacters})
    return {isLoading, isError, characters}
}