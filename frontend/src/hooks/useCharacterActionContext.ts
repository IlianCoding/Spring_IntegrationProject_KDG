import { useContext } from "react";
import CharacterActionContext from "../contexts/game/characterActionContext.ts";

export const useCharacterActionContext = () => {
    const context = useContext(CharacterActionContext);
    if (!context) {
        throw new Error('useCharacterActionContext must be used within a CharacterActionProvider');
    }
    return context;
};