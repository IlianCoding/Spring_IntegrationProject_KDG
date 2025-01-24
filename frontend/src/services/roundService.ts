import axios from "axios";
import {PlayerState} from "../model/game/PlayerState.ts";
import {CharacterDeck} from "../model/game/character/CharacterDeck.ts";

const API_URL = "/rounds"

export const getCharacterDeckOfRound = async (roundId: string): Promise<CharacterDeck> => {
    const response = await axios.get<CharacterDeck>(`${API_URL}/${roundId}/characterdeck`);
    return response.data;
}

export const putPlayerStateCharacters = async (playerId: string, characterId: string, roundId: string): Promise<PlayerState> => {
    const response = await axios.put<PlayerState>(`${API_URL}/${playerId}/${characterId}/${roundId}`);
    return response.data;
};