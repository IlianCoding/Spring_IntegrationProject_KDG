import {Profile} from '../profile/Profile.ts';

export type Lobby = {
    id: string;
    open: boolean;
    number: number;
    profiles: Profile[],
    averageLoyaltyPoints: number;
    ownerId: string;
};