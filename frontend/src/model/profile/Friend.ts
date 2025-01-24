import {Achievement} from './Achievement.ts';

export type Friend = {
    id: string | undefined;
    userName: string;
    name: string;
    subText: string
    avatarUrl: string;
    birthday: Date;
    achievements: Achievement[];
    email: string;
};