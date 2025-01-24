import {useMutation, useQuery} from "@tanstack/react-query";
import {getPopularQuestions, sendMessageToChatbot} from "../services/chatBotService.ts";
import {AiMessage} from "../model/game/AI/AiMessage.ts";

export const useSendMessageToChatbot = () => {
    const {mutate, isPending, isError, isSuccess, data} = useMutation({
        mutationFn: (message: AiMessage) => sendMessageToChatbot(message),
    });
    return {mutate, isPending, isError, isSuccess, data};
};

export const useGetPopularQuestions = () => {
    const {data, isLoading, isError} = useQuery({
        queryKey: ['popularQuestions'],
        queryFn: getPopularQuestions,
        refetchInterval: 30000,
    });
    return {data, isLoading, isError};
};