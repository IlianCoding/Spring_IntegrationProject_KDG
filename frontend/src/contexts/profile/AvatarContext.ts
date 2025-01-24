import {createContext} from 'react';

interface AvatarContextProps {
    appliedAvatarSrc: string;
    setAppliedAvatarSrc: (src: string) => void;
}

const AvatarContext = createContext<AvatarContextProps>({
    appliedAvatarSrc: '',
    setAppliedAvatarSrc: () => {
    },
});

export default AvatarContext;