import axios from 'axios';
import {AiMessage} from "../model/game/AI/AiMessage.ts";

const API_URL = '/chatbot';

export const sendMessageToChatbot = async (message: AiMessage) => {
    try {
        const response = await axios.post(`${API_URL}`, message, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error sending message to chatbot:', error);
        throw error;
    }
};

export const getPopularQuestions = async () => {
    try {
        const response = await axios.get(`${API_URL}/popular-questions`);
        return response.data;
    } catch (error) {
        console.error('Error fetching popular questions:', error);
        throw error;
    }
};