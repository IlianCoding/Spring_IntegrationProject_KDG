import {Box, Container, Typography} from "@mui/material";
import {FriendList} from "./FriendList.tsx";
import {useNavigate, useParams} from "react-router-dom";
import {useContext, useEffect} from "react";
import lobbyContext from "../../../contexts/lobby/LobbyContext.ts";
import {useTranslation} from "react-i18next";
import {useGetLatestGameOfLobbyWithRefetch} from "../../../hooks/useGame.ts";
import {SetTimer} from "./SetTimer.tsx"; // Import the SetTimer component
import SecurityContext from "../../../contexts/SecurityContext.ts"; // Import the SecurityContext
import './lobby.css';

export function LobbyPage() {
    const {t} = useTranslation();
    const {lobbyId: parLobbyId} = useParams<{ lobbyId: string }>();
    const {lobby} = useContext(lobbyContext);
    const {userId} = useContext(SecurityContext);
    const profileId = userId || '';

    const {data: latestGame} = useGetLatestGameOfLobbyWithRefetch(parLobbyId ?? "");
    const navigate = useNavigate();

    useEffect(() => {
        if (latestGame && latestGame.numberOfRounds > 0 && latestGame.startTime && !latestGame.completed) {
            navigate(`/game/${latestGame.id}`);
        }
    }, [latestGame, navigate]);


    const isOwner = lobby?.ownerId === profileId;

    return (
        <Container maxWidth="lg" className="container-lobby">
            <Box className={"profile-background-friends"}>
                <Box sx={{padding: 2}}>
                    {isOwner ? (
                        <Typography variant="h3">{t("Let's start playing")}</Typography>
                    ) : (
                        <Typography variant="h3">
                            {(lobby?.profiles?.length ?? 0) < 3 ? t("Waiting for the lobby to fill up") : t("Waiting for the owner to start the game")}
                        </Typography>
                    )}
                    <FriendList isOwner={isOwner}/>
                    {isOwner && (
                        <>
                            <SetTimer players={lobby?.profiles}/>
                        </>
                    )}
                </Box>
            </Box>
        </Container>
    );
}