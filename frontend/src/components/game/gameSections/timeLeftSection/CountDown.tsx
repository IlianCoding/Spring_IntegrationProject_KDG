import {useEffect, useState} from "react";
import useGameContext from "../../../../hooks/useGameContext.ts";
import {Box, Snackbar, Typography} from "@mui/material";
import {useTranslation} from 'react-i18next';

function Countdown() {
    const {t} = useTranslation();
    const [timeLeft, setTimeLeft] = useState<number>(300);
    const [isFlickering, setIsFlickering] = useState<boolean>(false);
    const [showPopup, setShowPopup] = useState<boolean>(false);
    const {remainingTime, isPlayersTurn} = useGameContext();

    useEffect(() => {
        if (!isPlayersTurn) {
            setTimeLeft(-1);
            return;
        }

        if (remainingTime !== undefined) {
            setTimeLeft(remainingTime);
        }

        const interval = setInterval(() => {
            setTimeLeft(prevTime => Math.max(prevTime - 1, 0));
        }, 1000);

        return () => clearInterval(interval);
    }, [remainingTime, isPlayersTurn]);

    useEffect(() => {
        if (!isPlayersTurn) return;

        const syncInterval = setInterval(() => {
            if (remainingTime !== undefined && timeLeft !== remainingTime) {
                setTimeLeft(remainingTime);
            }
        }, 10000);

        return () => clearInterval(syncInterval);
    }, [remainingTime, timeLeft, isPlayersTurn]);

    useEffect(() => {
        if (timeLeft < 30) {
            const flickerInterval = setInterval(() => {
                setIsFlickering(prev => !prev);
            }, 1000);

            return () => clearInterval(flickerInterval);
        } else {
            setIsFlickering(false);
        }

        if (timeLeft === 30 || timeLeft === 10) {
            setShowPopup(true);
        }
    }, [timeLeft]);

    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
    };

    return (
        <Box>
            {timeLeft === -1 ? (
                <Typography className="time-left-time-section" variant="h2">{t('Not your turn')}</Typography>
            ) : (
                <Typography
                    className="time-left-time-section"
                    variant="h1"
                    style={{
                        color: isFlickering ? 'red' : 'inherit',
                        transition: 'color 0.5s'
                    }}
                >
                    {formatTime(timeLeft)}
                </Typography>
            )}
            <Snackbar
                open={showPopup}
                autoHideDuration={6000}
                onClose={() => setShowPopup(false)}
                message={timeLeft > 10 ? t('30 seconds left!') : t('10 seconds left!')}
                anchorOrigin={{vertical: 'top', horizontal: 'right'}}
                ContentProps={{
                    sx: {
                        backgroundColor: '#4B0082',
                        color: "white",
                        mt: 8
                    }
                }}
            />
        </Box>
    );
}

export default Countdown;