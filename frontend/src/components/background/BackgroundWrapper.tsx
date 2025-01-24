import {ReactNode} from 'react';
import {Box} from '@mui/material';
import './background.css';

const images = [
    '/assets/home/medieval-bg-2.jpg',
    '/assets/home/medieval-bg-3.jpg',
    '/assets/home/medieval-bg-4.jpg',
    '/assets/home/medieval-bg-5.jpg',
    '/assets/home/medieval-bg-6.jpg',
    '/assets/home/medieval-bg-7.jpg'
];

const shuffleArray = (array: string[]): string[] => {
    return array.sort(() => Math.random() - 0.5);
};

interface BackgroundWrapperProps {
    children: ReactNode;
}

const BackgroundWrapper = ({children}: BackgroundWrapperProps) => {
    return (
        <Box className="bg-fade-wrapper" sx={{position: 'relative', minHeight: '100vh', zIndex: 0}}>
            {children}
            {shuffleArray(images).map((image, index) => (
                <Box key={index} className={`bg-fade ${index === 0 ? 'initial-fade' : ''}`} sx={{
                    zIndex: -1,
                    backgroundImage: `url(${image})`,
                }}/>
            ))}
        </Box>
    );
}

export default BackgroundWrapper;