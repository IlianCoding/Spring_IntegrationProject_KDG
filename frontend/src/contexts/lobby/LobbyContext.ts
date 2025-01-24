import {Lobby} from "../../model/game/Lobby.ts";
import {Profile} from "../../model/profile/Profile.ts";
import {createContext} from "react";

interface LobbyContextProps{
    lobby:Lobby|undefined,
    lobbyId: string |undefined,
    players: Profile[],
    isLoading: boolean,
    isError: boolean
}
export default createContext<LobbyContextProps>({
    lobby: undefined,
    lobbyId: '',
    players: [],
    isLoading:false,
    isError:    false
})