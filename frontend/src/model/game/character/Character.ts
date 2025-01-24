import {Color} from "../../enum/Color.ts";

export type Character = {
    id: string;
    name: string;
    number: number;
    image: string;
    color: Color;
    hasPlayedThisRound: boolean;
    description: string;
}