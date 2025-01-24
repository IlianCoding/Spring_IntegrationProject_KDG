import axios from 'axios';
import {Turn} from '../model/game/Turn.ts';
import {Building} from '../model/game/building/Building.ts';

const API_URL = '/turns';

export const takeCoins = async (turnId: string, amount: number, isCharacterAbility: boolean): Promise<Turn> => {
    const response = await axios.post<Turn>(`${API_URL}/${turnId}/take-coins/${amount}/${isCharacterAbility}`);
    return response.data;
};

export const getBuildingDeckSize = async (turnId: string): Promise<number> => {
    const response = await axios.get<number>(`${API_URL}/${turnId}/get-building-deck-size`);
    return response.data;
};

export const getRemainingCoinsInBank = async (turnId: string): Promise<number> => {
    const response = await axios.get<number>(`${API_URL}/${turnId}/get-remaining-coins-in-bank`);
    return response.data;
};

export const getCompletedFases = async (turnId: string): Promise<Set<string>> => {
    const response = await axios.get<string[]>(`${API_URL}/${turnId}/completedFases`);
    return new Set(response.data);
};

export const drawBuildings = async (turnId: string, amount: number, isCharacterAbility: boolean): Promise<Building[]> => {
    const response = await axios.post<Building[]>(`${API_URL}/${turnId}/draw-buildings/${amount}/${isCharacterAbility}`);
    return response.data;
};

export const putBackBuilding = async (turnId: string, building: Building): Promise<Turn> => {
    const response = await axios.post<Turn>(`${API_URL}/${turnId}/put-back-building`, building);
    return response.data;
};

export const buildBuilding = async (turnId: string, buildingId: string): Promise<Turn> => {
    const response = await axios.post<Turn>(`${API_URL}/${turnId}/build-building/${buildingId}`);
    return response.data;
};

export const getLatestTurnByGameAndProfile = async (gameId: string, profileId: string): Promise<Turn> => {
    const response = await axios.get<Turn>(`${API_URL}/latest-turn/${gameId}/${profileId}`);
    return response.data;
};

export const isPlayersTurn = async (gameId: string, profileId: string): Promise<boolean> => {
    const response = await axios.get<boolean>(`${API_URL}/is-players-turn/${gameId}/${profileId}`);
    return response.data;
};

export const getRemainingTime = async (turnId: string): Promise<number> => {
    const response = await axios.get<number>(`${API_URL}/${turnId}/remaining-time`);
    return response.data;
};

export const getLatestTurn = async (gameId: string): Promise<Turn> => {
    const response = await axios.get<Turn>(`${API_URL}/latest-turn/${gameId}`);
    return response.data;
};
