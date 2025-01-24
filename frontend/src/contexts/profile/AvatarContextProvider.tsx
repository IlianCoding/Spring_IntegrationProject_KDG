import {ReactElement, useState} from 'react';
import AvatarContext from './AvatarContext.ts';

interface IWithChildren {
    children: ReactElement | ReactElement[];
}

export default function AvatarContextProvider({children}: IWithChildren) {
    const [appliedAvatarSrc, setAppliedAvatarSrc] = useState<string>('');

    return (
        <AvatarContext.Provider value={{appliedAvatarSrc, setAppliedAvatarSrc}}>
            {children}
        </AvatarContext.Provider>
    );
}