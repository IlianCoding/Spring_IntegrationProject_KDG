import {act, render} from '@testing-library/react';
import Countdown from './CountDown.tsx';
import useGameContext from '../../../../hooks/useGameContext.ts';
import {afterEach, beforeEach, describe, expect, it, Mock, vi} from 'vitest';

vi.mock('../../../../hooks/useGameContext');

describe('CountdownTimer', () => {
    beforeEach(() => {
        const mockUseGameContext = useGameContext as Mock;
        mockUseGameContext.mockReturnValue({
            remainingTime: 300,
            isPlayersTurn: true,
        });
        vi.useFakeTimers();
        localStorage.clear();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('should start the timer with the correct initial value', () => {
        const {getByText} = render(<Countdown/>);
        expect(getByText('5:00')).toBeDefined();
    });

    it('should count down correctly when it is the player\'s turn', () => {
        const {getByText} = render(<Countdown/>);
        act(() => {
            vi.advanceTimersByTime(1000);
        });
        expect(getByText('4:59')).toBeDefined();
    });
});