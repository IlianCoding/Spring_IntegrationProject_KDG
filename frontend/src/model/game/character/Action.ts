export interface Action {
    executiveCharacterId: string;
    targetCharacterId: string;
    targetPlayerId: string;
    executivePlayerId: string;
    choice: boolean;
    buildingIdsToExchange: string[];
    gameId: string;
    targetBuildingId: string;
    turnId: string;
}