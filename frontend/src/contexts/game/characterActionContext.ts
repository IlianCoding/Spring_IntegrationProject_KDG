import {createContext} from "react";
import {Character} from "../../model/game/character/Character.ts";
import {Player} from "../../model/game/Player.ts";
import {Building} from "../../model/game/building/Building.ts";
import {Turn} from "../../model/game/Turn.ts";
import {Game} from "../../model/game/Game.ts";
import {Action} from "../../model/game/character/Action.ts";

interface CharacterActionContextProps {
    selectedCharacter: Character | null;
    setSelectedCharacter: (character: Character | null) => void;
    targetCharacter: Character | null;
    setTargetCharacter: (character: Character | null) => void;
    targetPlayer: Player | null;
    setTargetPlayer: (player: Player | null) => void;
    choice: boolean;
    setChoice: (choice: boolean) => void;
    buildingsToExchange: Building[];
    setBuildingsToExchange: (buildings: Building[]) => void;
    targetBuilding: Building | null;
    setTargetBuilding: (building: Building | null) => void;
    handlePerformAction: (turn: Turn, game: Game, characterActions: { mutate: (arg0: Action) => void; }) => void;
}

const CharacterActionContext = createContext<CharacterActionContextProps | null>(null);

export default CharacterActionContext;