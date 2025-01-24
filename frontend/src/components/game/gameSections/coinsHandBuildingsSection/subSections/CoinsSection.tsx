import {Box, Tooltip, Typography} from "@mui/material";
import useGameContext from "../../../../../hooks/useGameContext.ts";
import {useTranslation} from 'react-i18next';

interface CoinsSectionProps {
    coinsInBank: number | undefined;
    numberOfCoins: number | undefined;
}

function CoinsSection({coinsInBank, numberOfCoins}: CoinsSectionProps) {
    const {t} = useTranslation();
    const {isPlayersTurn} = useGameContext();

    return (
        <Box className={`coins-section ${!isPlayersTurn ? 'disabled' : ''}`}
             sx={{display: 'flex', flexDirection: 'column', gap: '16px'}}>
            <Tooltip title={t('Coins in bank: {{coinsInBank}}', {coinsInBank})}>
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center'
                }} className="gold-icon-container">
                    <img src="/assets/gold-chest-and-pouch.png" alt="Gold" style={{width: '237px', height: '163px'}}/>
                    <Typography variant="h4" className="gold-amount" style={{fontSize: '2rem'}}>
                        {coinsInBank ?? '2'}
                    </Typography>
                </Box>
            </Tooltip>
            <Tooltip title={t('Coins you have: {{numberOfCoins}}', {numberOfCoins: numberOfCoins ?? '2'})}>
                <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}
                     className="gold-icon-container">
                    <img
                        src={
                            (numberOfCoins ?? 2) > 10
                                ? "/assets/gold-chest.png"
                                : (numberOfCoins ?? 2) >= 5
                                    ? "/assets/gold-pouch.png"
                                    : "/assets/gold-pile.png"
                        }
                        alt="Gold"
                        style={{width: '187px', height: '113px'}}
                    />
                    <Typography variant="h4" className="gold-amount" style={{fontSize: '2rem'}}>
                        {numberOfCoins ?? '2'}
                    </Typography>
                </Box>
            </Tooltip>
        </Box>
    );
}

export default CoinsSection;