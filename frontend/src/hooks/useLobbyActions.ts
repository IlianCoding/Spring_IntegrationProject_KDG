import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {
    addPlayer,
    createLobby,
    getLobby,
    setDuration,
    startGame,
    getLobbyGames,
    makeChoiceAfterGame,
    getAllOpenLobbies, getAutomaticallyJoinedLobby
} from "../services/lobbyService.ts";

export const useGetLobby = (lobbyId: string) => {
    const {data, isLoading, isError} = useQuery({
        queryKey: ['lobby', lobbyId],
        queryFn: () => getLobby(lobbyId),
        enabled: !!lobbyId,
        refetchInterval: 5000
    });
    return {data, isLoading, isError};
};

export const useLobbyGames = (lobbyId: string) => {
    const {data, isLoading, isError} = useQuery({
        queryKey: ['lobbyGames', lobbyId],
        queryFn: () => getLobbyGames(lobbyId),
        enabled: !!lobbyId,
    });
    return {data, isLoading, isError};
};
export const useMakeChoiceAfterGame = (lobbyId: string) => {
    const queryClient = useQueryClient();
    const {mutate, data, isPending, isError} = useMutation({
        mutationFn: (gameChoice: boolean) => makeChoiceAfterGame(lobbyId, gameChoice),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['lobby', lobbyId]});
        }
    });
    return {mutate, data, isPending, isError};
};

export const useAddPlayer = () => {
    const queryClient = useQueryClient();
    const {mutate, isPending, isError, isSuccess} = useMutation({
        mutationFn: ({lobbyId, profileId}: {
            lobbyId: string
            profileId: string
        }) => addPlayer(lobbyId, profileId),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['lobby']});
        }
    });
    return {mutate, isPending, isError, isSuccess};
};
export const useSetDuration = () => {
    const queryClient = useQueryClient();
    const {mutate, isPending, isError} = useMutation({
        mutationFn: ({lobbyId, duration}: {lobbyId: string, duration: number}) =>
            setDuration(lobbyId, duration),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['lobby']});
        }
    });
    return {mutate, isPending, isError};
};

export const useCreateLobby= ()=>{
    const queryClient = useQueryClient();
    const {
        mutate,
        data,
        isPending,
        isError
    } = useMutation(
        {
            mutationFn: (profileId: string) => createLobby(profileId),
            onSuccess: () => {
                queryClient.invalidateQueries({queryKey: ['lobby']});
            }
        });
    return {mutate, data, isPending, isError};
}

export const useStartGame= ()=>{
    const queryClient = useQueryClient();
    const {
        mutate,
        isPending,
        isError,
        isSuccess
    } = useMutation(
        {
            mutationFn: (lobbyId: string) => startGame(lobbyId),
            onSuccess: () => {
                queryClient.invalidateQueries({queryKey: ['lobby']});
            }
        });
    return {mutate, isPending, isError, isSuccess};
};
export const useGetAllOpenLobbies = () => {
    const {data, isLoading, isError} = useQuery({
        queryKey: ['open-lobbies'],
        queryFn: () => getAllOpenLobbies(),
        refetchInterval: 5000
    });
    return {data, isLoading, isError};
};
export const useGetAutomaticallyJoinedLobby = () => {
    const queryClient = useQueryClient();
    const {mutate, isPending, isError, data, isSuccess} = useMutation({
        mutationFn: (profileId: string) =>
            getAutomaticallyJoinedLobby(profileId),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['lobby']});
        }
    });
    return {mutate, isPending, isError, data, isSuccess};
};