import {fireEvent, render, screen, waitFor} from '@testing-library/react';
import {describe, expect, test, vi} from 'vitest';
import EditProfileSection from './EditProfileSection.tsx';
import {Profile} from '../../../../model/profile/Profile.ts';
import {Channel} from '../../../../model/enum/Channel.ts';
import userEvent from '@testing-library/user-event';

describe('EditProfileSection Component', () => {
    const mockProfile: Profile = {
        id: '1',
        name: 'John Doe',
        userName: 'johndoe',
        email: 'john.doe@gmail.com',
        subText: 'This is a subtext',
        numberOfLoyaltyPoints: 0,
        birthday: new Date(),
        avatarUrl: 'https://via.placeholder.com/150',
        channel: Channel.MAIL,
        friends: [],
        achievements: [],
        gimmicks: [],
        activeGimmicks: [],
    };
    const handleSave = vi.fn();
    const handleCancel = vi.fn();

    test('renders profile fields', () => {
        render(
            <EditProfileSection
                profile={mockProfile}
                onSave={handleSave}
                onCancel={handleCancel}
            />
        );
        expect(screen.getByLabelText('Name')).toBeDefined();
        expect(screen.getByLabelText('Birthday')).toBeDefined();
        expect(screen.getByLabelText('Channel')).toBeDefined();
    });

    test('calls onSave with valid data', async () => {
        render(
            <EditProfileSection
                profile={mockProfile}
                onSave={handleSave}
                onCancel={handleCancel}
            />
        );

        await userEvent.type(screen.getByLabelText('Name'), 'Jane Doe');
        await userEvent.type(screen.getByLabelText('Birthday'), '2000-01-01');

        fireEvent.mouseDown(screen.getByLabelText('Channel'));
        fireEvent.click(screen.getByText(Channel.MESSAGECENTER));

        fireEvent.click(screen.getByRole('button', {name: /Save/i}));

        await waitFor(() => {
            expect(handleSave).toHaveBeenCalledOnce();
            expect(screen.queryByText('Name cannot be empty')).toBeNull();
            expect(screen.queryByText('Name must be 50 characters or less')).toBeNull();
            expect(screen.queryByText('Birthday cannot be in the future')).toBeNull();
            expect(screen.queryByText('Invalid channel value')).toBeNull();
        });
    });

    test('displays validation errors for max values', async () => {
        render(
            <EditProfileSection
                profile={mockProfile}
                onSave={handleSave}
                onCancel={handleCancel}
            />
        );

        const nameInputContainer = screen.getByLabelText('Name');
        const nameInput = nameInputContainer.querySelector('input') as HTMLInputElement;

        await userEvent.clear(nameInput);
        await userEvent.type(nameInput, 'a'.repeat(51));
        await userEvent.click(screen.getByRole('button', {name: /Save/i}));

        await waitFor(() => {
            expect(screen.getByText('Name must be 50 characters or less')).toBeDefined();
        });
    });

    test('displays validation errors for min values', async () => {
        render(
            <EditProfileSection
                profile={mockProfile}
                onSave={handleSave}
                onCancel={handleCancel}
            />
        );

        const nameInputContainer = screen.getByLabelText('Name');
        const nameInput = nameInputContainer.querySelector('input') as HTMLInputElement;

        await userEvent.clear(nameInput);
        await userEvent.click(screen.getByRole('button', {name: /Save/i}));

        await waitFor(() => {
            expect(screen.getByText('Name cannot be empty')).toBeDefined();
        });
    });

    test('calls onCancel when cancel button is clicked', async () => {
        render(
            <EditProfileSection
                profile={mockProfile}
                onSave={handleSave}
                onCancel={handleCancel}
            />
        );

        await userEvent.click(screen.getByRole('button', {name: /cancel/i}));

        await waitFor(() => {
            expect(handleCancel).toHaveBeenCalled();
        });
    });
});