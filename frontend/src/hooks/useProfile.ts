import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {
    activateGimmick,
    addFriend,
    deactivateGimmick,
    getFriendProfile,
    createProfile,
    checkProfileExists,
    getProfile,
    getProfiles,
    putProfileAvatarUrl,
    removeFriend,
    updateLocale,
    updateProfile
} from "../services/profileService.ts";
import { Profile } from "../model/profile/Profile.ts";

export const useGetProfile = (profileId: string) => {
    const {data, isLoading, isError} = useQuery({
        queryKey: ['profile'],
        queryFn: () => getProfile(profileId),
        enabled: !!profileId
    });

    return {data, isLoading, isError};
};

export const useCreateProfile=()=>{
    const queryClient = useQueryClient();
    const {
        mutate,
        isPending,
        isSuccess,
        isError
    } = useMutation(
        {
        mutationFn: (profile: Profile) => createProfile(profile),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['profile']});
        }
    });
    return {mutate, isPending, isError, isSuccess};
}

export const useGetAllProfiles = () => {
    const {data, isLoading, isError} = useQuery({
        queryKey: ['profiles'],
        queryFn: () => getProfiles(),
    });

    return {data, isLoading, isError};
}

export const usePutProfileAvatarUrl = () => {
    const queryClient = useQueryClient();
    const {mutate, isPending, isError} = useMutation({
        mutationFn: ({profileId, avatarUrl}: {
            profileId: string,
            avatarUrl: string
        }) => putProfileAvatarUrl(profileId, avatarUrl),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['profile']});
        }
    });
    return {mutate, isPending, isError};
};

export const useUpdateProfile = () => {
    const queryClient = useQueryClient();
    const {mutate, isPending, isError} = useMutation({
        mutationFn: (profile: Profile) => updateProfile(profile),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['profile']});
        }
    });
    return {mutate, isPending, isError};
};

export const useAddFriend = () => {
    const queryClient = useQueryClient();
    const {mutate, isPending, isError} = useMutation({
        mutationFn: ({profileId, friendId}: {
            profileId: string,
            friendId: string
        }) => addFriend(profileId, friendId),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['profile']});
        }
    });
    return {mutate, isPending, isError};
};

export const useRemoveFriend = () => {
    const queryClient = useQueryClient();
    const {mutate, isPending, isError} = useMutation({
        mutationFn: ({profileId, friendId}: {
            profileId: string,
            friendId: string
        }) => removeFriend(profileId, friendId),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['profile']});
        }
    });
    return {mutate, isPending, isError};
};

export const useGetFriendProfile = (name: string = '', userName: string = '') => {
    return useQuery({
        queryKey: ['friendProfile', name, userName],
        queryFn: () => getFriendProfile(name, userName),
        enabled: !!name && !!userName
    });
};

export const useActivateGimmick = () => {
    const queryClient = useQueryClient();
    const {mutate, isPending, isError} = useMutation({
        mutationFn: ({profileId, gimmickId}: {
            profileId: string,
            gimmickId: string
        }) => activateGimmick(profileId, gimmickId),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['profile']});
        }
    });
    return {mutate, isPending, isError};
};

export const useDeactivateGimmick = () => {
    const queryClient = useQueryClient();
    const {mutate, isPending, isError} = useMutation({
        mutationFn: ({profileId, gimmickId}: {
            profileId: string,
            gimmickId: string
        }) => deactivateGimmick(profileId, gimmickId),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['profile']});
        }
    });
    return {mutate, isPending, isError};
};
export const useProfileExists= ()=>{
    const {mutate, isSuccess, isPending, isError, data} = useMutation({
        mutationFn: (profileEmail: string) => checkProfileExists(profileEmail),
    });
    return {mutate, isSuccess, isPending, isError, data};
}

export const useUpdateLocale = () => {
    const queryClient = useQueryClient();
    const {mutate, isPending, isError} = useMutation({
        mutationFn: ({profileId, localeString}: {
            profileId: string,
            localeString: string
        }) => updateLocale(profileId, localeString),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['profile']});
        }
    });
    return {mutate, isPending, isError};
};