import {Button, Tooltip} from '@mui/material';
import useGameContext from "../../../../../hooks/useGameContext.ts";
import {useTranslation} from 'react-i18next';

interface DrawBuildingsButtonProps {
    canDrawBuildings: boolean;
    isLoadingBuildings: boolean;
    isIncomePhaseCompleted: boolean;
    hasTakenAction: boolean;
    handleDrawBuildingsClick: () => void;
}

function DrawBuildingsButton({
                                 canDrawBuildings,
                                 isLoadingBuildings,
                                 isIncomePhaseCompleted,
                                 handleDrawBuildingsClick,
                             }: DrawBuildingsButtonProps) {
    const {t} = useTranslation();
    const {buildingDeckSize = 0, isPlayersTurn} = useGameContext();

    return (
        <Tooltip
            title={
                !isPlayersTurn
                    ? t("You cannot draw buildings outside your turn")
                    : isLoadingBuildings
                        ? t("Loading...")
                        : buildingDeckSize < 2
                            ? t("Not enough buildings in deck to draw")
                            : isIncomePhaseCompleted
                                ? t("You already took coins or buildings")
                                : ""
            }
        >
        <span style={{
            cursor: isPlayersTurn ? 'url(\'/assets/Medieval-pointer-resized.cur\'), auto' : 'not-allowed',
        }}>
            <Button
                sx={{width: '70%'}}
                onClick={handleDrawBuildingsClick}
                disabled={isLoadingBuildings || !canDrawBuildings || !isPlayersTurn}
            >
                {t("Take 2 buildings")}
            </Button>
        </span>
        </Tooltip>
    );
}

export default DrawBuildingsButton;