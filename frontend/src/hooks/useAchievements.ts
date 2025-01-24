import {useQuery} from "@tanstack/react-query";
import {getAllAchievements} from "../services/achievementService.ts";

export const useGetAllAchievements = () => {
    const {data, isLoading, isError} = useQuery({
        queryKey: ['achievements'],
        queryFn: () => getAllAchievements(),
    });

    return {data, isLoading, isError};
};