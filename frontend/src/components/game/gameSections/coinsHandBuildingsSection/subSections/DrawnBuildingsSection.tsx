import {useEffect, useState} from 'react';
import {Box, Tooltip, Typography} from '@mui/material';
import {Building} from '../../../../../model/game/building/Building.ts';
import {useTranslation} from 'react-i18next';

interface DrawnBuildingsSectionProps {
    listDrawnBuildings: Building[];
    handlePutBackBuilding: (building: Building) => void;
}

function DrawnBuildingsSection({listDrawnBuildings, handlePutBackBuilding}: DrawnBuildingsSectionProps) {
    const {t} = useTranslation();
    const [drawnBuildings, setDrawnBuildings] = useState<Building[]>([]);

    useEffect(() => {
        const storedBuildings = localStorage.getItem('drawnBuildings');
        if (storedBuildings) {
            setDrawnBuildings(JSON.parse(storedBuildings));
        } else {
            setDrawnBuildings(listDrawnBuildings);
            if (listDrawnBuildings.length > 0)
                localStorage.setItem('drawnBuildings', JSON.stringify(listDrawnBuildings));
        }
    }, [listDrawnBuildings]);

    const handlePutBack = (building: Building) => {
        handlePutBackBuilding(building);
        setDrawnBuildings([]);
        localStorage.removeItem('drawnBuildings');
    };
    if (drawnBuildings.length === 0) return null;

    return (
        <Box className="drawn-buildings">
            <Typography variant="h6">{t('Choose a building to put back:')}</Typography>
            <Box sx={{display: 'flex', gap: '16px', flexWrap: 'wrap', mt: '10px'}}>
                {drawnBuildings.map((building, index) => (
                    <Tooltip key={`${building.id}-${index}`}
                             title={t('Click to put back {{buildingName}}', {buildingName: building.name})}>
                        <Box id={`${building.id + '' + index}`} className="building-item-main"
                             onClick={() => handlePutBack(building)}
                             style={{cursor: 'url(\'/assets/Medieval-pointer-resized.cur\'), auto'}}>
                            <img src={building.imgUrl} alt={building.name} style={{
                                marginRight: '4px',
                                width: '100px',
                                height: '162px',
                                opacity: 1
                            }}/>
                        </Box>
                    </Tooltip>
                ))}
            </Box>
        </Box>
    );
}

export default DrawnBuildingsSection;