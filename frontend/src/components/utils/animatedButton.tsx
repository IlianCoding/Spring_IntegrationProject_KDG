import React, {forwardRef, useState} from 'react';
import {Box, Fab, FabProps} from '@mui/material';
import {css, keyframes} from '@emotion/react';
import {styled} from '@mui/material/styles';

const editButtonAnimation = keyframes`
    0% {
        transform: rotate(-20deg);
    }
    50% {
        transform: rotate(30deg);
    }
    75% {
        transform: rotate(20deg);
    }
    100% {
        transform: rotate(0deg);
    }
`;

const saveButtonAnimation = keyframes`
    0% {
        transform: scale(1);
    }
    50% {
        transform: scale(1.2);
    }
    100% {
        transform: scale(1);
    }
`;

const fileMoveAnimation = keyframes`
    0% {
        transform: translateY(0) translateX(0);
        opacity: 0;
    }
    25% {
        transform: translateY(-5px) translateX(5px);
        opacity: 0.5;
    }
    50% {
        transform: translateY(-10px) translateX(12px);
        opacity: 1;
    }
    75% {
        transform: translateY(5px) translateX(12px) scale(0.6);
        opacity: 0.5;
    }
    100% {
        transform: translateY(10px) translateX(12px) scale(0.4);
        opacity: 0;
    }
`;

const trashCanAnimation = keyframes`
    0% {
        transform: scale(1.2) translateX(-10px) translateY(10px);
    }
    25% {
        transform: scale(1.2) translateX(-10px) translateY(15px);
    }
    50% {
        transform: scale(1.2) translateX(-10px) translateY(15px);
    }
    75% {
        transform: scale(1.2) translateX(-10px) translateY(15px);
    }
    100% {
        transform: scale(1.2) translateX(-10px) translateY(15px);
    }
`;

const animations = {
    edit: editButtonAnimation,
    save: saveButtonAnimation,
    cancel: fileMoveAnimation,
};

const StyledFab = styled(Fab, {
    shouldForwardProp: (prop) => prop !== 'animate' && prop !== 'animationType' && prop !== 'animationDuration',
})<{ animate?: boolean, animationType?: keyof typeof animations, animationDuration?: number }>`
    ${({animate, animationType, animationDuration}) => animate && css`
        animation: ${animations[animationType || 'edit']} ${animationDuration || 0.5}s;
    `}
    background-color: #4B0082;
    color: white;
    border: 2px solid #FFD700;
    font-family: 'MedievalSharp', cursive;

    &:hover {
        background-color: #6A0DAD;
    }
`;

interface AnimatedButtonProps extends FabProps {
    children: React.ReactNode;
    animationType?: keyof typeof animations;
    animationDuration?: number;
    onClickAction?: () => void;
}

const AnimatedButton = forwardRef<HTMLButtonElement, AnimatedButtonProps>(({
                                                                               children,
                                                                               animationType = 'edit',
                                                                               animationDuration = 0.5,
                                                                               onClickAction,
                                                                               ...props
                                                                           }, ref) => {
    const [animate, setAnimate] = useState(false);

    const handleClick = () => {
        setAnimate(true);
        setTimeout(() => {
            setAnimate(false);
            if (onClickAction) onClickAction()
        }, animationDuration * 1000);
    };

    return (
        <StyledFab ref={ref} onClick={handleClick} animate={animate && animationType !== 'cancel'}
                   animationType={animationType}
                   animationDuration={animationDuration} {...props}>
            {animationType === 'cancel' && React.Children.count(children) === 2 ? (
                <Box display="flex" alignItems="center">
                    {React.Children.map(children, (child, index) => (
                        <Box key={index}
                             sx={{
                                 opacity: index === 0 ? 0 : 1,
                                 transform: index === 1 ? 'translateX(-12px) translateY(4px) scale(1.2)' : 'none',
                                 animation: animate ? `${index === 0 ? fileMoveAnimation : trashCanAnimation} ${animationDuration || 0.5}s` : 'none'
                             }}>
                            {child}
                        </Box>
                    ))}
                </Box>
            ) : (
                children
            )}
        </StyledFab>
    );
});

export default AnimatedButton;