import {Player} from './Player.ts';
import {BuildingDeck} from './building/BuildingDeck.ts';
import {PlayerState} from "./PlayerState.ts";
import {Lobby} from "./Lobby.ts";

export type Game = {
    id: string;
    turnDuration: number;
    startTime: string;
    endTime: string;
    coinsInBank: number;
    numberOfRounds: number;
    completed: boolean;
    winner: Player;
    lobby: Lobby
    playerStates: PlayerState[];
    buildingDeck: BuildingDeck;
}