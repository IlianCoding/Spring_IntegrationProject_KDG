from fastapi import APIRouter
from fastapi.params import Depends

from app.core.initialization import get_faq_service
from app.services.frequently_asked_service import FAQService

router = APIRouter()

@router.get("/popular-questions")
async def get_top_faq_questions(
        limit: int = 5,
        faq_service: FAQService = Depends(get_faq_service)
):
    try:
        top_questions = await faq_service.get_top_faq_questions(limit=limit)
        return {
            "response": top_questions
        }
    except Exception as e:
        return {"response": f"An error occurred: {str(e)}, please try again later."}