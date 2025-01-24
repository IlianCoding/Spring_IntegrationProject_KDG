import {Player} from "../game/Player.ts";

export type OngoingGame = {
    gameId: string;
    lobbyId: string;
    players: Player[];
    playerWithCurrentTurn: Player;
    duration: number;
}