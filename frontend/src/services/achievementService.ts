import axios from "axios";
import {Achievement} from "../model/profile/Achievement.ts";

const API_URL = "/achievements"


export const getAllAchievements = async (): Promise<Achievement[]> => {
    const response = await axios.get<Achievement[]>(`${API_URL}`);
    return response.data;
};
