from fastapi import APIRouter
from fastapi.params import Depends

from app.core.initialization import get_chatbot_service
from app.schemas.chatbot import ChatbotResponse, ChatbotRequest
from app.services.chatbot_service import ChatbotService

router = APIRouter()

@router.post("/", response_model=ChatbotResponse)
async def talk_to_chatbot(
        chatbot_request: ChatbotRequest,
        chatbot_service: ChatbotService = Depends(get_chatbot_service)
):
    try:
        response = await chatbot_service.process_question(chatbot_request.message)
        return ChatbotResponse(response=response["answer"])
    except Exception as e:
        return ChatbotResponse(response=f"An error occurred: {str(e)}, please try again later.")