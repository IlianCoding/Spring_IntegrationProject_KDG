import {useEffect, useState} from 'react';
import {Building} from '../../../../model/game/building/Building.ts';
import useGameContext from '../../../../hooks/useGameContext.ts';
import CoinsSection from './subSections/CoinsSection.tsx';
import DrawnBuildingsSection from './subSections/DrawnBuildingsSection.tsx';
import HandBuildingsSection from './subSections/HandBuildingsSection.tsx';
import {Box} from "@mui/material";

interface CoinsHandBuildingsSectionProps {
    listDrawnBuildings: Building[];
    handlePutBackBuilding: (building: Building) => void;
    handleBuildBuilding: (buildingId: string) => void;
}

function CoinsHandBuildingsSection({
                                       listDrawnBuildings,
                                       handlePutBackBuilding,
                                       handleBuildBuilding,
                                   }: CoinsHandBuildingsSectionProps) {
    const [isBuildPhaseCompleted, setIsBuildPhaseCompleted] = useState(false);
    const {coinsInBank, latestTurnByGameAndProfileData, isPlayersTurn} = useGameContext();

    useEffect(() => {
        setIsBuildPhaseCompleted(new Set(latestTurnByGameAndProfileData?.completedFases ?? []).has('BUILDFASE'));
    }, [latestTurnByGameAndProfileData]);

    return (
        <Box className={`coins-hand-buildings-section ${!isPlayersTurn ? 'disabled' : ''}`}>
            <CoinsSection coinsInBank={coinsInBank}
                          numberOfCoins={latestTurnByGameAndProfileData?.playerState?.numberOfCoins}/>
            <Box className={`hand-buildings-section ${!isPlayersTurn ? 'disabled' : ''}`}>
                <DrawnBuildingsSection
                    listDrawnBuildings={listDrawnBuildings}
                    handlePutBackBuilding={handlePutBackBuilding}
                />
                <HandBuildingsSection
                    listDrawnBuildings={listDrawnBuildings}
                    buildingsInHand={latestTurnByGameAndProfileData?.playerState?.buildingsInHand}
                    numberOfCoins={latestTurnByGameAndProfileData?.playerState?.numberOfCoins}
                    isBuildPhaseCompleted={isBuildPhaseCompleted}
                    handleBuildBuilding={handleBuildBuilding}
                    characters={latestTurnByGameAndProfileData?.playerState?.characters}
                />
            </Box>
        </Box>
    );
}

export default CoinsHandBuildingsSection;