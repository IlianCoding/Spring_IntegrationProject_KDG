from fastapi import FastAPI, Depends

from app.api.endpoints import chatbot, rules, models, faqs
from app.core.initialization import get_faq_service, get_rule_service, initialize_singletons, get_chatbot_service
app = FastAPI(title="API Integration project 2024")

@app.on_event("startup")
def initialize_database():
    initialize_singletons()
@app.get("/")
def basic_healthcheck():
    return {
        "status": "ok",
        "message": "API is running smoothly"
    }

app.include_router(chatbot.router, prefix="/api/chatbot", tags=["chatbot"], dependencies=[Depends(get_chatbot_service)])
app.include_router(rules.router, prefix="/api/rules", tags=["rules"], dependencies=[Depends(get_rule_service)])
app.include_router(models.router, prefix="/api/models", tags=["models"])
app.include_router(faqs.router, prefix="/api/faqs", tags=["faqs"], dependencies=[Depends(get_faq_service)])