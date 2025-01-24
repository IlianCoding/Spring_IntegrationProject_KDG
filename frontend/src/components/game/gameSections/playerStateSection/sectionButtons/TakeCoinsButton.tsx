import {Button, Tooltip} from '@mui/material';
import useGameContext from "../../../../../hooks/useGameContext.ts";
import {useTranslation} from 'react-i18next';

interface TakeCoinsButtonProps {
    canTakeCoins: boolean;
    isLoadingCoins: boolean;
    isIncomePhaseCompleted: boolean;
    hasTakenAction: boolean;
    handleTakeCoinsClick: () => void;
}

function TakeCoinsButton({
                             canTakeCoins,
                             isLoadingCoins,
                             isIncomePhaseCompleted,
                             handleTakeCoinsClick,
                         }: TakeCoinsButtonProps) {
    const {t} = useTranslation();
    const {isPlayersTurn, coinsInBank = 0} = useGameContext();

    return (
        <Tooltip
            title={
                !isPlayersTurn
                    ? t("You cannot take coins outside your turn")
                    : isLoadingCoins
                        ? t("Loading...")
                        : coinsInBank < 2
                            ? t("Not enough coins in bank to take")
                            : isIncomePhaseCompleted
                                ? t("You already took coins or buildings")
                                : ""
            }
        >
        <span style={{
            cursor: isPlayersTurn ? 'url(\'/assets/Medieval-pointer-resized.cur\'), auto' : 'not-allowed',
        }}>
            <Button
                sx={{
                    width: '70%',
                    cursor: isPlayersTurn ? 'url(\'/assets/Medieval-pointer-resized.cur\'), auto' : 'not-allowed',
                }}
                onClick={handleTakeCoinsClick}
                disabled={isLoadingCoins || !canTakeCoins || !isPlayersTurn}
            >
                {t("Take 2 coins")}
            </Button>
        </span>
        </Tooltip>
    );
}

export default TakeCoinsButton;