import {fireEvent, render, screen} from '@testing-library/react';
import {describe, expect, test, vi} from 'vitest';
import ProfileListItem from './ProfileListItem';
import {Friend} from '../../../../model/profile/Friend';

describe('ProfileListItem Component', () => {
    const mockFriend: Friend = {
        id: '1',
        name: 'John Doe',
        userName: 'johndoe',
        subText: 'subtext',
        avatarUrl: 'https://via.placeholder.com/150',
        birthday: new Date(),
        achievements: [],
        email: 'john.doe@gmail.com',
    };
    const friendsSet = new Set(['johndoe']);
    const handleProfileClick = vi.fn();
    const handleRemoveFriendClick = vi.fn();
    const handleAddFriendClick = vi.fn();

    test('renders friend name and username', () => {
        render(
            <ProfileListItem
                friend={mockFriend}
                friendsSet={friendsSet}
                handleProfileClick={handleProfileClick}
                handleRemoveFriendClick={handleRemoveFriendClick}
                handleAddFriendClick={handleAddFriendClick}
            />
        );
        expect(screen.getByText('John Doe')).toBeDefined();
        expect(screen.getByText('johndoe')).toBeDefined();
    });

    test('calls handleProfileClick when profile icon is clicked', () => {
        render(
            <ProfileListItem
                friend={mockFriend}
                friendsSet={friendsSet}
                handleProfileClick={handleProfileClick}
                handleRemoveFriendClick={handleRemoveFriendClick}
                handleAddFriendClick={handleAddFriendClick}
            />
        );
        fireEvent.click(screen.getByLabelText('View Profile'));
        expect(handleProfileClick).toHaveBeenCalledWith('John Doe');
    });

    test('calls handleRemoveFriendClick when remove friend icon is clicked', () => {
        render(
            <ProfileListItem
                friend={mockFriend}
                friendsSet={friendsSet}
                handleProfileClick={handleProfileClick}
                handleRemoveFriendClick={handleRemoveFriendClick}
                handleAddFriendClick={handleAddFriendClick}
            />
        );
        fireEvent.click(screen.getByLabelText('Remove Friend'));
        expect(handleRemoveFriendClick).toHaveBeenCalledWith('John Doe');
    });

    test('calls handleAddFriendClick when add friend icon is clicked', () => {
        const newFriendsSet: Set<string> = new Set();
        render(
            <ProfileListItem
                friend={mockFriend}
                friendsSet={newFriendsSet}
                handleProfileClick={handleProfileClick}
                handleRemoveFriendClick={handleRemoveFriendClick}
                handleAddFriendClick={handleAddFriendClick}
            />
        );
        fireEvent.click(screen.getByLabelText('Add Friend'));
        expect(handleAddFriendClick).toHaveBeenCalledWith('John Doe');
        newFriendsSet.add(mockFriend.userName);
        expect(newFriendsSet.has(mockFriend.userName)).toBe(true);
    });
});