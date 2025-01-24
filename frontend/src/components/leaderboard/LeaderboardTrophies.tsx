import {Typography} from "@mui/material";

export function getTrophy(rank: number) {
    switch (rank) {
        case 1:
            return <img src="/assets/leaderboard/GoldTrophy.png" alt="Gold Trophy"
                        style={{width: '48px', height: '48px'}}/>;
        case 2:
            return <img src="/assets/leaderboard/SilverTrophy.png" alt="Silver Trophy"
                        style={{width: '48px', height: '48px'}}/>;
        case 3:
            return <img src="/assets/leaderboard/BronzeTrophy.png" alt="Bronze Trophy"
                        style={{width: '48px', height: '48px'}}/>;
        default:
            return <Typography variant="h6">{rank}</Typography>;
    }
}