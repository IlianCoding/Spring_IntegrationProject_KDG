import {useEffect} from 'react';

const useHoverEffect = (classes: string[]) => {
    useEffect(() => {
        const handleMouseMove = (event: MouseEvent) => {
            const target = event.target as HTMLElement;
            if (target && typeof target.closest === 'function') {
                const item = classes.map(cls => target.closest(`.${cls}`)).find(Boolean) as HTMLElement | null;
                if (item) {
                    const rect = item.getBoundingClientRect();
                    const mouseX = event.clientX - rect.left;
                    const mouseY = event.clientY - rect.top;
                    const width = rect.width;
                    const height = rect.height;

                    const rotateY = (mouseX / width * 30) - 15;
                    const rotateX = (mouseY / height * -30) + 15;

                    item.style.transition = 'transform 0.2s ease';
                    item.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
                }
            }
        };

        const handleMouseLeave = (event: MouseEvent) => {
            const target = event.target as HTMLElement;
            if (target && typeof target.closest === 'function') {
                const item = classes.map(cls => target.closest(`.${cls}`)).find(Boolean) as HTMLElement | null;
                if (item) {
                    item.style.transform = '';
                }
            }
        };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseleave', handleMouseLeave, true);

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseleave', handleMouseLeave, true);
        };
    }, [classes]);
};

export default useHoverEffect;