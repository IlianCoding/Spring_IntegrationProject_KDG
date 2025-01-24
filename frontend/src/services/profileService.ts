import axios from "axios";
import {Profile} from "../model/profile/Profile.ts";
import {Friend} from "../model/profile/Friend.ts";

const API_URL = "/profiles";

export const getProfile = async (profileId: string): Promise<Profile> => {
    const response = await axios.get<Profile>(`${API_URL}/${profileId}`);
    return response.data;
};

export const createProfile = async (profile: Profile): Promise<void> => {
    await axios.post(`${API_URL}/register`, profile, {
        headers: {
            'Content-Type': 'application/json'
        }
    });
};

export const getProfiles = async (): Promise<Profile[]> => {
    const response = await axios.get<Profile[]>(API_URL);
    return response.data;
};

export const putProfileAvatarUrl = async (profileId: string, avatarUrl: string): Promise<void> => {
    await axios.put(`${API_URL}/${profileId}/avatar`, avatarUrl, {
        headers: {
            'Content-Type': 'text/plain'
        }
    });
};

export const updateProfile = async (profile: Profile): Promise<void> => {
    await axios.put(API_URL, profile, {
        headers: {
            'Content-Type': 'application/json'
        }
    });
};

export const addFriend = async (profileId: string, friendId: string): Promise<void> => {
    await axios.put(`${API_URL}/${profileId}/friends/${friendId}`);
};

export const removeFriend = async (profileId: string, friendId: string): Promise<void> => {
    await axios.delete(`${API_URL}/${profileId}/friends/${friendId}`);
};

export const getFriendProfile = async (name: string, userName: string): Promise<Friend> => {
    const response = await axios.get<Friend>(`${API_URL}/friend/${name}/${userName}`);
    return response.data;
};

export const activateGimmick = async (profileId: string, gimmickId: string): Promise<void> => {
    await axios.put(`${API_URL}/${profileId}/activate-gimmick/${gimmickId}`);
};

export const deactivateGimmick = async (profileId: string, gimmickId: string): Promise<void> => {
    await axios.put(`${API_URL}/${profileId}/deactivate-gimmick/${gimmickId}`);
};

export const updateLocale = async (profileId: string, localeString: string): Promise<void> => {
    await axios.put(`${API_URL}/${profileId}/locale/${localeString}`);
};
export const checkProfileExists = async (profileEmail:string): Promise<boolean> => {
    const response = await axios.get<boolean>(`${API_URL}/exists/${profileEmail}`);
    return response.data;
};