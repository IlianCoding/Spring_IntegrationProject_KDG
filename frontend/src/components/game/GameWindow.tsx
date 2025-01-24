import {Box} from '@mui/material';
import {MapInteractionCSS} from "react-map-interaction";
import GamePage from "./gameSections/GamePage.tsx";
import {GameContextProvider} from "../../contexts/game/GameContextProvider.tsx";
import {useContext, useEffect, useState} from 'react';
import {DndProvider} from 'react-dnd';
import {HTML5Backend} from 'react-dnd-html5-backend';
import {useNavigate} from 'react-router-dom';
import ChatBotSection from "./ChatBot.tsx";
import securityContext from "../../contexts/SecurityContext.ts";
import {useGetProfile} from "../../hooks/useProfile.ts";
import {useTranslation} from 'react-i18next';
import {InfoDialog} from "./gameSections/infoSection/InfoDialog.tsx";

function GameWindow() {
    const {t} = useTranslation();
    const windowWidth = window.innerWidth;
    const initialTranslationX = windowWidth / 2 - 800;
    const navigate = useNavigate();
    const {userId} = useContext(securityContext);
    const profileId = userId || '';
    const {data: profile} = useGetProfile(profileId);
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    document.title = t("Game Window") + " - Machiavelli";

    const [backgroundStyle, setBackgroundStyle] = useState({
        backgroundImage: 'url(\'https://i.imgur.com/kRegqCk.jpeg\')',
        backgroundColor: 'transparent'
    });

    const [mapState, setMapState] = useState({
        scale: 0.75,
        translation: {x: initialTranslationX, y: 3}
    });

    const handleChange = (value: { scale: number; translation: { x: number; y: number; } }) => {
        const {scale, translation} = value;
        setMapState({scale, translation});
    };

    const handleReset = () => {
        const windowWidth = window.innerWidth;
        const translationX = windowWidth / 2 - 800;
        setMapState({
            scale: 0.75,
            translation: {x: translationX, y: 3}
        });
    };

    useEffect(() => {
        if (profile) {
            const backgroundColorGimmick = profile.activeGimmicks.find(g => g.type.toLowerCase() === 'backgroundcolor');
            if (backgroundColorGimmick) {
                setBackgroundStyle({
                    backgroundImage: 'none',
                    backgroundColor: backgroundColorGimmick.name.split(' ')[0].toLowerCase()
                });
            }
        }
    }, [profile]);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'r' || event.key === 'R') {
                handleReset();
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [mapState]);

    useEffect(() => {
        const handleResize = () => {
            const windowWidth = window.innerWidth;
            const translationX = windowWidth / 2 - 800;
            setMapState({
                scale: 0.75,
                translation: {x: translationX, y: 3}
            });
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return (
        <Box className="main-map" sx={{
            width: '100%',
            height: '100vh',
            position: 'relative',
            overflow: 'hidden',
            backgroundImage: backgroundStyle.backgroundImage,
            backgroundColor: backgroundStyle.backgroundColor,
            backgroundPosition: 'center',
            backgroundAttachment: 'scroll',
            backgroundSize: 'cover',
            cursor: 'url(\'/assets/Medieval-cursor.cur\'), auto !important'
        }}>
            <InfoDialog isOpen={isDialogOpen}
                        onClose={() => setIsDialogOpen(false)}></InfoDialog>
            <Box className="home-control" onClick={() => navigate('/')}>
                {t('Go to Home')}
            </Box>
            <Box className="instruction-control" onClick={() => setIsDialogOpen(true)}>
                {t('Instructions')}
            </Box>
            <Box className="reset-control" onClick={handleReset}>
                {t('Press R to reset view')}
            </Box>
            <GameContextProvider>
                <ChatBotSection/>
                <MapInteractionCSS
                    value={mapState}
                    onChange={handleChange}
                    minScale={0.75}
                    maxScale={1}
                    translationBounds={{xMin: -1460, xMax: 660, yMin: -940, yMax: 240}}
                >
                    <Box sx={{
                        width: '2880px',
                        height: '1080px',
                        position: 'relative',
                        transform: `scale(${mapState.scale})`,
                        transformOrigin: '0 0',
                        cursor: 'url(\'/assets/Medieval-cursor-resized.cur\'), auto;'
                    }}>
                        <DndProvider backend={HTML5Backend}>
                            <GamePage/>
                        </DndProvider>
                    </Box>
                </MapInteractionCSS>
            </GameContextProvider>
        </Box>
    );
}

export default GameWindow;