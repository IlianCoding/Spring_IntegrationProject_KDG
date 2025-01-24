import {useContext} from "react";
import GameContext from "../contexts/game/GameContext.ts";

const useGameContext = () => {
    const context = useContext(GameContext);
    if (!context) {
        throw new Error('useGameContext must be used within an GameContextProvider');
    }
    return context;
};

export default useGameContext;