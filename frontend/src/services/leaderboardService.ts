import axios from 'axios';
import {PlayerScore} from "../model/leaderboard/PlayerScore.ts";

const API_URL = '/leaderboards';

export const getTopPlayers = async (): Promise<PlayerScore[]> => {
    const response = await axios.get<PlayerScore[]>(`${API_URL}/top`);
    return response.data;
};

export const getPersonalScores = async (profileId: string): Promise<PlayerScore[]> => {
    const response = await axios.get<PlayerScore[]>(`${API_URL}/${profileId}`);
    return response.data;
};

export const getPersonalFriends = async (profileId: string): Promise<PlayerScore[]> => {
    const response = await axios.get<PlayerScore[]>(`${API_URL}/${profileId}/friends`);
    return response.data;
};