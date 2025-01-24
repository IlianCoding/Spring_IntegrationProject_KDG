import {Round} from './Round.ts';
import {PlayerState} from './PlayerState.ts';

export type Turn = {
    id: string;
    completedFases: Set<string>;
    completed: boolean;
    createdAt: Date;
    round: Round;
    playerState: PlayerState;
    hasDrawnBuilding: boolean;
    amountOfBuildingsBuiltThisTurn: number;
    notification: string;
}