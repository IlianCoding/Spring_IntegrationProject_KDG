import {Player} from './Player.ts';
import {Character} from './character/Character.ts';
import {Building} from './building/Building.ts';

export type PlayerState = {
    id: string;
    score: number;
    numberOfCoins: number;
    assassinated: boolean;
    isKing: boolean;
    number: number
    player: Player;
    characters: Character[];
    charactersThatHavePlayed: Character[];
    buildingsBuilt: Building[];
    buildingsInHand: Building[];
    notification: string;
}