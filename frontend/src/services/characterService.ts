import axios from "axios";
import {Character} from "../model/game/character/Character.ts";

export async function getAllCharacters() {
    const {data} = await axios.get<Character[]>(`/characters`)
    return data
}
