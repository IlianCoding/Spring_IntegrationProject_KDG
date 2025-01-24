import {Channel} from '../enum/Channel.ts';
import {Achievement} from './Achievement.ts';
import {Gimmick} from './Gimmick.ts';
import {Friend} from "./Friend.ts";

export type Profile = {
    id: string;
    userName: string;
    name: string;
    subText: string;
    numberOfLoyaltyPoints: number;
    birthday: Date;
    avatarUrl: string;
    channel: Channel;
    friends: Friend[];
    achievements: Achievement[];
    gimmicks: Gimmick[];
    activeGimmicks: Gimmick[];
    email: string;
};