import axios from 'axios';

const API_URL = '/roundTurns';

export const endTurn = async (turnId: string): Promise<void> => {
    await axios.post<void>(`${API_URL}/${turnId}/end-turn`);
};

export const getCountOfAllTurnsFromRound = async (roundId: string): Promise<number> => {
    const response = await axios.get<number>(`${API_URL}/${roundId}/turncount`);
    return response.data;
};