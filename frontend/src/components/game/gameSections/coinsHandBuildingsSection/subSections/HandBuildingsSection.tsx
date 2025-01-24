import {Box, Divider, Tooltip, Typography} from '@mui/material';
import {Building} from '../../../../../model/game/building/Building.ts';
import {Character} from "../../../../../model/game/character/Character.ts";
import useHoverEffect from "../../../../../hooks/CardEffects/useHoverEffect.ts";
import useGameContext from "../../../../../hooks/useGameContext.ts";
import {useTranslation} from 'react-i18next';

interface HandBuildingsSectionProps {
    listDrawnBuildings: Building[];
    buildingsInHand: Building[] | undefined;
    numberOfCoins: number | undefined;
    isBuildPhaseCompleted: boolean;
    handleBuildBuilding: (buildingId: string) => void;
    characters: Character[] | undefined;
}

function HandBuildingsSection({
                                  listDrawnBuildings,
                                  buildingsInHand,
                                  numberOfCoins,
                                  isBuildPhaseCompleted,
                                  handleBuildBuilding,
                                  characters
                              }: HandBuildingsSectionProps) {
    const {t} = useTranslation();
    useHoverEffect(['building-item']);

    const {isPlayersTurn} = useGameContext()

    if (listDrawnBuildings.length > 0 || !buildingsInHand || localStorage.getItem('drawnBuildings')) return null;
    return (
        <>
            <Typography className="buildings-title" variant="h6">{t('Buildings in hand:')}</Typography>
            <Divider/>
            <Box sx={{display: 'flex', gap: '16px', flexWrap: 'wrap', mt: '10px'}}>
                {buildingsInHand.map((building, index) => {
                    const canBuild = (numberOfCoins ?? 0) >= building.cost && !isBuildPhaseCompleted;
                    const isBuilder = characters?.some((character: { number: number }) => character.number === 7);
                    const tooltipTitle = !isPlayersTurn
                        ? t("You cannot build outside your turn")
                        : canBuild
                            ? t('Click to build a {{buildingName}}', {buildingName: building.name})
                            : isBuildPhaseCompleted
                                ? isBuilder
                                    ? t("You have already built 3 buildings this round")
                                    : t("You have already built a building this round")
                                : t("Not enough coins to build this building");
                    return (
                        <Tooltip key={`${building.id}-${index}`} title={tooltipTitle}>
                            <Box id={`${building.id + '' + index}`} className="building-item-main"
                                 onClick={() => handleBuildBuilding(building.id)}
                                 style={{cursor: canBuild && isPlayersTurn ? 'url(\'/assets/Medieval-pointer-resized.cur\'), auto' : 'not-allowed'}}>
                                <img src={building.imgUrl} alt={t(building.name)} style={{
                                    marginRight: '4px',
                                    width: '100px',
                                    height: '162px',
                                    opacity: canBuild ? 1 : 0.5
                                }}/>
                            </Box>
                        </Tooltip>
                    );
                })}
            </Box>
        </>
    );
}

export default HandBuildingsSection;