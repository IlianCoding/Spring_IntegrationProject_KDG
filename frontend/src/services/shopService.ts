import axios from "axios";
import {Gimmick} from "../model/profile/Gimmick.ts";

const API_URL = "/shop";

export const getGimmick = async (gimmickId: string): Promise<Gimmick> => {
    const response = await axios.get<Gimmick>(`${API_URL}/gimmick/${gimmickId}`);
    return response.data;
};

export const getGimmicks = async (): Promise<Gimmick[]> => {
    const response = await axios.get<Gimmick[]>(`${API_URL}/gimmicks`);
    return response.data;
};

export const getActiveGimmicks = async (profileId: string): Promise<Gimmick[]> => {
    const response = await axios.get<Gimmick[]>(`${API_URL}/active-gimmicks-of-player/${profileId}`);
    return response.data;
};

export const getGimmicksOfPlayer = async (profileId: string): Promise<Gimmick[]> => {
    const response = await axios.get<Gimmick[]>(`${API_URL}/gimmicks-of-player/${profileId}`);
    return response.data;
};

export const purchaseGimmick = async (gimmickId: string, profileId: string): Promise<Gimmick> => {
    const response = await axios.put<Gimmick>(`${API_URL}/${gimmickId}/purchase/${profileId}`);
    return response.data;
};