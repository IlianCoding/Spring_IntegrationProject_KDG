import {useContext} from 'react';
import AvatarContext from '../contexts/profile/AvatarContext.ts';

const useAvatarContext = () => {
    const context = useContext(AvatarContext);
    if (!context) {
        throw new Error('useAvatarContext must be used within an AvatarProvider');
    }
    return context;
};

export default useAvatarContext;