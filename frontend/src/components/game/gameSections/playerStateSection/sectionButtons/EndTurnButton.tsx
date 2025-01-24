import {Button, Tooltip} from '@mui/material';
import {Building} from "../../../../../model/game/building/Building.ts";
import useGameContext from "../../../../../hooks/useGameContext.ts";
import {useTranslation} from 'react-i18next';

interface EndTurnButtonProps {
    listDrawnBuildings: Building[] | undefined;
    handleEndTurnClick: () => void;
    isPending: boolean;
}

function EndTurnButton({
                           listDrawnBuildings,
                           handleEndTurnClick,
                           isPending,
                       }: EndTurnButtonProps) {
    const {t} = useTranslation();
    const {isPlayersTurn} = useGameContext();
    const storedDrawnBuildings = localStorage.getItem('drawnBuildings');
    const parsedDrawnBuildings: Building[] = storedDrawnBuildings ? JSON.parse(storedDrawnBuildings) : [];

    const effectiveDrawnBuildings = listDrawnBuildings && listDrawnBuildings.length > 0 ? listDrawnBuildings : parsedDrawnBuildings;

    return (
        <Tooltip
            title={
                !isPlayersTurn
                    ? t("You cannot end turn outside your turn")
                    : t("You cannot end turn when you still need to put a building back")
            }
            disableHoverListener={(!effectiveDrawnBuildings || effectiveDrawnBuildings.length === 0) && isPlayersTurn}
        >
        <span style={{
            cursor: isPlayersTurn ? 'url(\'/assets/Medieval-pointer-resized.cur\'), auto' : 'not-allowed',
        }}>
            <Button
                sx={{width: '70%'}}
                onClick={handleEndTurnClick}
                disabled={!isPlayersTurn || isPending || (!effectiveDrawnBuildings || effectiveDrawnBuildings.length !== 0)}
            >
                {t("End Turn")}
            </Button>
        </span>
        </Tooltip>
    );
}

export default EndTurnButton;