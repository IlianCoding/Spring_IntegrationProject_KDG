import {ReactNode} from "react";
import {useParams} from "react-router-dom";
import {useGetLobby} from "../../hooks/useLobbyActions.ts";
import LobbyContext from "./LobbyContext.ts";

interface LobbyContextProviderProps {
    children: ReactNode;
}

export const LobbyContextProvider = ({children}: LobbyContextProviderProps) => {
    const {lobbyId: parLobbyId} = useParams<{ lobbyId: string }>();
    const {data: lobby, isLoading, isError} = useGetLobby(parLobbyId ?? '');
    const lobbyId = lobby?.id;
    const players = lobby?.profiles || [];

    return (
        <LobbyContext.Provider
            value={{
                lobby,
                lobbyId,
                players,
                isLoading,
                isError
            }}
        >
            {children}
        </LobbyContext.Provider>
    );
}