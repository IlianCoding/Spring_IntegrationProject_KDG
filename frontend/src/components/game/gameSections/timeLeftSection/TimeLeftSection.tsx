import CountDown from "./CountDown.tsx";
import {Box} from "@mui/material";
import useGameContext from "../../../../hooks/useGameContext.ts";
import {useTranslation} from 'react-i18next';

function TimeLeftSection() {
    const {isPlayersTurn} = useGameContext();
    const {t} = useTranslation();

    return (
        <Box className={`time-left ${!isPlayersTurn ? 'disabled' : ''}`}>
            {isPlayersTurn && `${t('Time left: ')}`}<CountDown/>
        </Box>
    );
}

export default TimeLeftSection;