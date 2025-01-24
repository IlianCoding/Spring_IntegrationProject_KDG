import axios from 'axios';
import {Game} from '../model/game/Game.ts';
import {OngoingGame} from '../model/profile/OngoingGame.ts';

const API_URL = '/game';

export const getGameById = async (gameId: string): Promise<Game> => {
    const response = await axios.get<Game>(`${API_URL}/${gameId}`);
    return response.data;
};

export const getOngoingGames = async (profileId: string): Promise<OngoingGame[]> => {
    const response = await axios.get<OngoingGame[]>(`${API_URL}/${profileId}/ongoing-games`);
    return response.data;
};

export const getLatestGameOfLobby = async (lobbyId: string): Promise<Game> => {
    const response = await axios.get<Game>(`${API_URL}/${lobbyId}/latest-game`);
    return response.data;
};

export const getGamesOfWeek = async (profileId: string): Promise<Game[]> => {
    const response = await axios.get<Game[]>(`${API_URL}/${profileId}/get-games-of-week`);
    return response.data;
};