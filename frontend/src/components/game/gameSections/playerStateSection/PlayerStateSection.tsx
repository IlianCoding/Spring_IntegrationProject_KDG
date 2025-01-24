import {useEffect, useState} from 'react';
import {Building} from "../../../../model/game/building/Building.ts";
import useGameContext from "../../../../hooks/useGameContext.ts";
import TakeCoinsButton from './sectionButtons/TakeCoinsButton.tsx';
import DrawBuildingsButton from './sectionButtons/DrawBuildingsButton.tsx';
import EndTurnButton from './sectionButtons/EndTurnButton.tsx';
import {Box, Divider, Typography} from "@mui/material";
import {useTranslation} from 'react-i18next';

interface PlayerStateSectionProps {
    canTakeCoins: boolean;
    canDrawBuildings: boolean;
    isLoadingCoins: boolean;
    isLoadingBuildings: boolean;
    completedFases: Set<string> | undefined;
    handleTakeCoins: () => void;
    handleDrawBuildings: () => void;
    listDrawnBuildings: Building[] | undefined;
}

function PlayerStateSection({
                                canTakeCoins,
                                canDrawBuildings,
                                isLoadingCoins,
                                isLoadingBuildings,
                                completedFases = new Set<string>(),
                                handleTakeCoins,
                                handleDrawBuildings,
                                listDrawnBuildings,
                            }: PlayerStateSectionProps) {
    const {latestTurnByGameAndProfileData, endTurn, isPlayersTurn} = useGameContext();
    const {t} = useTranslation();
    const [hasTakenAction, setHasTakenAction] = useState(false);
    const isIncomePhaseCompleted = completedFases instanceof Set && completedFases.has('INCOMEFASE');

    useEffect(() => {
        if (!isPlayersTurn) {
            localStorage.removeItem('hasTakenAction');
            localStorage.removeItem('endTime');
        }
    }, [isPlayersTurn]);

    const handleEndTurnClick = () => {
        endTurn.mutate(latestTurnByGameAndProfileData?.id ?? '');
        localStorage.removeItem('hasTakenAction');
        localStorage.removeItem('endTime');
    };

    const handleTakeCoinsClick = () => {
        handleTakeCoins();
        setHasTakenAction(true);
    };

    const handleDrawBuildingsClick = () => {
        handleDrawBuildings();
        setHasTakenAction(true);
    };

    useEffect(() => {
        const storedHasTakenAction = localStorage.getItem('hasTakenAction');
        if (storedHasTakenAction) {
            setHasTakenAction(JSON.parse(storedHasTakenAction));
        }
    }, []);

    useEffect(() => {
        const storedHasTakenAction = localStorage.getItem('hasTakenAction');
        if (storedHasTakenAction && storedHasTakenAction === 'true' && !hasTakenAction) {
            setHasTakenAction(true)
        } else {
            localStorage.setItem('hasTakenAction', JSON.stringify(hasTakenAction));
        }
    }, [hasTakenAction]);

    return (
        <Box className={`player-state ${!isPlayersTurn ? 'disabled' : ''}`}>
            <Typography variant="h6" className={"player-action-title"} sx={{mb: '10px', textAlign: 'center'}}>
                {t('Player actions')}
            </Typography>
            <Divider/>
            <Box className="actions">
                <TakeCoinsButton
                    canTakeCoins={canTakeCoins}
                    isLoadingCoins={isLoadingCoins}
                    isIncomePhaseCompleted={isIncomePhaseCompleted}
                    hasTakenAction={hasTakenAction}
                    handleTakeCoinsClick={handleTakeCoinsClick}
                />
                <DrawBuildingsButton
                    canDrawBuildings={canDrawBuildings}
                    isLoadingBuildings={isLoadingBuildings}
                    isIncomePhaseCompleted={isIncomePhaseCompleted}
                    hasTakenAction={hasTakenAction}
                    handleDrawBuildingsClick={handleDrawBuildingsClick}
                />
                <EndTurnButton
                    listDrawnBuildings={listDrawnBuildings}
                    handleEndTurnClick={handleEndTurnClick}
                    isPending={endTurn.isPending}
                />
            </Box>
        </Box>
    );
}

export default PlayerStateSection;