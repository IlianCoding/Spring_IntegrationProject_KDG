import axios from "axios";
import {Lobby} from "../model/game/Lobby.ts";
import {Game} from "../model/game/Game.ts";

const API_URL = '/lobbies';

export const getLobby = async (lobbyId: string): Promise<Lobby> => {
    const response = await axios.get<Lobby>(`${API_URL}/${lobbyId}`);
    return response.data;
};

export const getLobbyGames = async (lobbyId: string) => {
    const response = await axios.get<Game[]>(`${API_URL}/${lobbyId}/games`);
    return response.data;
};

export const makeChoiceAfterGame = async (lobbyId: string, gameChoice: boolean): Promise<Lobby> => {
    const response = await axios.get<Lobby>(`${API_URL}/${lobbyId}/ended-game-choice`, {
        params: {gameChoice}
    });
    return response.data;
};

export const addPlayer = async (lobbyId: string, profileId: string): Promise<void> => {
    await axios.put<Lobby>(`${API_URL}/${lobbyId}/${profileId}`);
};

export const setDuration = async (lobbyId: string, duration: number): Promise<void> => {
    await axios.put<Lobby>(`${API_URL}/${lobbyId}/set-duration`,  duration ,{
        headers: {
            'Content-Type': 'application/json'
        }});
};

export const createLobby=async (profileId: string): Promise<Lobby> =>{
        const response= await axios.post<Lobby>(`${API_URL}/create`,  profileId ,{
            headers: {
                'Content-Type': 'application/json'
            }
        });
    return response.data;
};
export const startGame=async (lobbyId: string): Promise<void> =>{
        await axios.post<Lobby>(`${API_URL}/${lobbyId}/start`,  lobbyId ,{
            headers: {
                'Content-Type': 'application/json'
            }
        });
};
export const getAllOpenLobbies = async (): Promise<Lobby[]> => {
    const response = await axios.get<Lobby[]>(`${API_URL}/open`);
    return response.data;
};
export const getAutomaticallyJoinedLobby = async (profileId: string): Promise<Lobby> => {
     const response = await axios.put<Lobby>(`${API_URL}/join-automatically/${profileId}`);
     return response.data
};