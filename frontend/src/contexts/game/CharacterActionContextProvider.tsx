import {ReactNode, useState} from "react";
import CharacterActionContext from "./characterActionContext.ts";
import {Player} from "../../model/game/Player.ts";
import {Character} from "../../model/game/character/Character.ts";
import {Building} from "../../model/game/building/Building.ts";
import {Action} from "../../model/game/character/Action.ts";
import {Turn} from "../../model/game/Turn.ts";
import {Game} from "../../model/game/Game.ts";

export const CharacterActionProvider = ({children}: { children: ReactNode }) => {
    const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
    const [targetCharacter, setTargetCharacter] = useState<Character | null>(null);
    const [targetPlayer, setTargetPlayer] = useState<Player | null>(null);
    const [choice, setChoice] = useState<boolean>(false);
    const [buildingsToExchange, setBuildingsToExchange] = useState<Building[]>([]);
    const [targetBuilding, setTargetBuilding] = useState<Building | null>(null);

    const handlePerformAction = (turn: Turn, game: Game, characterActions: { mutate: (arg0: Action) => void; }) => {
        const executivePlayer = turn?.playerState.player;

        if (!executivePlayer || !game || !selectedCharacter) return;

        const action: Action = {
            executiveCharacterId: selectedCharacter.id,
            targetCharacterId: targetCharacter?.id || '',
            targetPlayerId: targetPlayer?.id || '',
            executivePlayerId: executivePlayer.id,
            choice: choice,
            buildingIdsToExchange: buildingsToExchange.map(building => building.id),
            gameId: game.id,
            targetBuildingId: targetBuilding?.id || '',
            turnId: turn.id
        };

        characterActions.mutate(action);

        setSelectedCharacter(null);
        setTargetCharacter(null);
        setTargetPlayer(null);
        setChoice(false);
        setBuildingsToExchange([]);
        setTargetBuilding(null);
    };

    return (
        <CharacterActionContext.Provider value={{
            selectedCharacter,
            setSelectedCharacter,
            targetCharacter,
            setTargetCharacter,
            targetPlayer,
            setTargetPlayer,
            choice,
            setChoice,
            buildingsToExchange,
            setBuildingsToExchange,
            targetBuilding,
            setTargetBuilding,
            handlePerformAction
        }}>
            {children}
        </CharacterActionContext.Provider>
    );
};