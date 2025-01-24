import {CharacterDeck} from './character/CharacterDeck.ts';
import {Game} from './Game.ts';
import {Player} from './Player.ts';

export interface Round {
    id: string;
    completed: boolean;
    fase: string;
    createdAt: string;
    characterDeck: CharacterDeck;
    game: Game;
    king: Player;
}