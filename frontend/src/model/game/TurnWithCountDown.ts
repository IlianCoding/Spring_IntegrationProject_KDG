import {Turn} from './Turn.ts';

export type TurnWithCountDown = {
    turn: Turn;
    duration: number;
}