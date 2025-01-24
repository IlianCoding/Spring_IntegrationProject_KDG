/// <reference types="vite-plugin-svgr/client" />
import axios from 'axios'
import HomePage from "./components/HomePage/HomePage.tsx";
import ProfilePage from "./components/Profile/ProfilePage.tsx";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import FriendProfilePage from "./components/Profile/FriendProfilePage.tsx";
import {RouteGuard} from "./components/RouteGuard.tsx";
import {StrictMode} from "react";
import SecurityContextProvider from "./contexts/SecurityContextProvider.tsx";
import {ThemeProvider as MuiThemeProvider, useTheme} from "@mui/material";
import ShopPage from "./components/shop/ShopPage.tsx";
import NotFoundPage from "./components/NotFoundPage.tsx";
import GameWindow from "./components/game/GameWindow.tsx";
import gameTheme from "./components/game/GameTheme.ts";
import {RegisterPage} from "./components/RegisterPage/RegisterPage.tsx";
import {AuthRedirector} from "./components/Profile/AuthRedirector.ts";
import LeaderboardPage from "./components/leaderboard/LeaderboardPage.tsx";
import Navbar from "./components/navigation/Navbar.tsx";
import {LobbyPage} from "./components/LobbyPage/startGame/LobbyPage.tsx";
import {LobbyContextProvider} from "./contexts/lobby/LobbyContextProvider.tsx";
import {AdminDashboard} from "./components/AdminPage/AdminDashboard.tsx";
import {LobbyOverview} from "./components/LobbyPage/lobbyOverview/LobbyOverview.tsx";
import DefaultThemeProvider from "./contexts/MuiThemeContextProvider.tsx";
import BackgroundWrapper from "./components/background/BackgroundWrapper.tsx";


axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL

function App() {
    const theme = useTheme()
    return (
        <SecurityContextProvider>
            <StrictMode>
                <DefaultThemeProvider theme={theme}>
                    <BackgroundWrapper>
                        <BrowserRouter future={{v7_startTransition: true, v7_relativeSplatPath: true}}>
                            <AuthRedirector/>
                            <Routes>
                                <Route path="/" element={<HomePage/>}/>
                                <Route path="/profile" element={<RouteGuard><ProfilePage/></RouteGuard>}/>
                                <Route path="/friend/:name/:userName"
                                       element={<RouteGuard><FriendProfilePage/></RouteGuard>}/>
                                <Route path="/lobbies" element={
                                    <RouteGuard><Navbar/><LobbyContextProvider><LobbyOverview/></LobbyContextProvider></RouteGuard>}/>
                                <Route path="/lobby/:lobbyId"
                                       element={
                                           <RouteGuard><Navbar/><LobbyContextProvider><LobbyPage/></LobbyContextProvider></RouteGuard>}/>

                                <Route path="/game/:gameId" element={<RouteGuard>
                                    <MuiThemeProvider theme={gameTheme}>
                                        <GameWindow/>
                                    </MuiThemeProvider>
                                </RouteGuard>}/>

                                <Route path={"/leaderboard"}
                                       element={<><Navbar/><LeaderboardPage/></>}/>
                                <Route path="/shop" element={<RouteGuard><ShopPage/></RouteGuard>}/>
                                <Route path="*" element={<RouteGuard><NotFoundPage/></RouteGuard>}/>
                                <Route path="/register" element={<RouteGuard><RegisterPage/></RouteGuard>}/>
                                <Route path={"/admin"} element={<RouteGuard><AdminDashboard/></RouteGuard>}/>
                            </Routes>
                        </BrowserRouter>
                    </BackgroundWrapper>
                </DefaultThemeProvider>
            </StrictMode>
        </SecurityContextProvider>
    );
}

export default App
