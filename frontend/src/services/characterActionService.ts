import axios from 'axios';
import {PlayerState} from '../model/game/PlayerState.ts';
import {Action} from "../model/game/character/Action.ts";

const API_URL = '/character';

export const performCharacterAction = async (action: Action): Promise<PlayerState> => {
    const response = await axios.post<PlayerState>(`${API_URL}/get-action`, action);
    return response.data;
};

export const canPerformMercenaryAction = async (executivePlayerId: string, targetBuildingId: string): Promise<boolean> => {
    const response = await axios.get<boolean>(`${API_URL}/can-perform-mercenary-action/${executivePlayerId}/${targetBuildingId}`);
    return response.data;
};