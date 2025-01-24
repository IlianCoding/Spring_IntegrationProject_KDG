import {GimmickType} from '../enum/GimmickType.ts';

export type Gimmick = {
    id: string;
    name: string;
    numberOfLoyaltyPoints: number;
    type: GimmickType;
};