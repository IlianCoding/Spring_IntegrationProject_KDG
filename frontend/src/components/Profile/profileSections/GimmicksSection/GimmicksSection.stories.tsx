import type {Meta, StoryObj} from '@storybook/react';
import GimmicksSection from './GimmicksSection';
import {Gimmick} from '../../../../model/profile/Gimmick';
import {GimmickType} from "../../../../model/enum/GimmickType.ts";
import {useState} from "react";
import {playSound} from "../../../utils/playSound.ts";

const mockGimmicks: Gimmick[] = [
    {
        id: '1',
        name: '#ff0000 backgroundcolor',
        numberOfLoyaltyPoints: Math.floor(Math.random() * 100),
        type: GimmickType.BACKGROUNDCOLOR,
    },
    {
        id: '2',
        name: '#00ff00 backgroundcolor',
        numberOfLoyaltyPoints: Math.floor(Math.random() * 100),
        type: GimmickType.BACKGROUNDCOLOR,
    },
    {
        id: '3',
        name: '#0000ff backgroundcolor',
        numberOfLoyaltyPoints: Math.floor(Math.random() * 100),
        type: GimmickType.BACKGROUNDCOLOR,
    },
    {
        id: '4',
        name: '#ffff00 backgroundcolor',
        numberOfLoyaltyPoints: Math.floor(Math.random() * 100),
        type: GimmickType.BACKGROUNDCOLOR,
    },
    {
        id: '5',
        name: 'Hey!: Thief',
        numberOfLoyaltyPoints: Math.floor(Math.random() * 200),
        type: GimmickType.SOUND,
    },
    {
        id: '6',
        name: 'Khajit has wares: merchant',
        numberOfLoyaltyPoints: Math.floor(Math.random() * 200),
        type: GimmickType.SOUND,
    },
    {
        id: '7',
        name: 'jeonghan',
        numberOfLoyaltyPoints: Math.floor(Math.random() * 300),
        type: GimmickType.AVATAR,
    },
    {
        id: '8',
        name: 'grumpycat',
        numberOfLoyaltyPoints: Math.floor(Math.random() * 300),
        type: GimmickType.AVATAR,
    },
    {
        id: '9',
        name: '#ff00ff backgroundcolor',
        numberOfLoyaltyPoints: Math.floor(Math.random() * 100),
        type: GimmickType.BACKGROUNDCOLOR,
    },
    {
        id: '10',
        name: '#00ffff backgroundcolor',
        numberOfLoyaltyPoints: Math.floor(Math.random() * 100),
        type: GimmickType.BACKGROUNDCOLOR,
    },
    {
        id: '11',
        name: 'pikachu',
        numberOfLoyaltyPoints: Math.floor(Math.random() * 300),
        type: GimmickType.AVATAR,
    },
    {
        id: '12',
        name: 'thisisfine',
        numberOfLoyaltyPoints: Math.floor(Math.random() * 300),
        type: GimmickType.AVATAR,
    },
    {
        id: '13',
        name: 'Wilhelm scream: assassin',
        numberOfLoyaltyPoints: Math.floor(Math.random() * 200),
        type: GimmickType.SOUND,
    },
    {
        id: '13',
        name: 'Nonexistent sound: ghost',
        numberOfLoyaltyPoints: Math.floor(Math.random() * 200),
        type: GimmickType.SOUND,
    },
    {
        id: '13',
        name: 'Nonexistent avatar: ghost',
        numberOfLoyaltyPoints: Math.floor(Math.random() * 200),
        type: GimmickType.AVATAR,
    },
];

const meta: Meta<typeof GimmicksSection> = {
    component: GimmicksSection,
};

export default meta;

interface GimmicksSectionProps {
    profileGimmicks: Gimmick[];
    playSound: (gimmickName: string) => void;
    playingSound: string | null;
    updateMainProfileAvatar: (avatarSrc: string) => void;
    profileAvatarUrl: string;
    activeGimmicks: Gimmick[];
}

const Template = (args: GimmicksSectionProps) => {
    const [playingSound, setPlayingSound] = useState<string | null>(args.playingSound);
    const [profileAvatarUrl, setProfileAvatarUrl] = useState<string>(args.profileAvatarUrl);

    const updateMainProfileAvatar = (avatarSrc: string) => {
        setProfileAvatarUrl(avatarSrc);
        args.updateMainProfileAvatar(avatarSrc);
    };

    return (
        <GimmicksSection
            {...args}
            playSound={(gimmickName: string) => playSound(gimmickName, setPlayingSound, playingSound)}
            playingSound={playingSound}
            updateMainProfileAvatar={updateMainProfileAvatar}
            profileAvatarUrl={profileAvatarUrl}
        />
    );
};

export const Default: StoryObj<GimmicksSectionProps> = {
    render: Template,
    args: {
        profileGimmicks: mockGimmicks,
        playingSound: null,
        updateMainProfileAvatar: (avatarSrc: string) => console.log(`Updating avatar to ${avatarSrc}`),
        profileAvatarUrl: 'https://via.placeholder.com/150',
        activeGimmicks: [],
    },
};

export const NoGimmicks: StoryObj<GimmicksSectionProps> = {
    render: Template,
    args: {
        profileGimmicks: [],
        playingSound: null,
        updateMainProfileAvatar: (avatarSrc: string) => console.log(`Updating avatar to ${avatarSrc}`),
        profileAvatarUrl: 'https://via.placeholder.com/150',
        activeGimmicks: [],
    },
};