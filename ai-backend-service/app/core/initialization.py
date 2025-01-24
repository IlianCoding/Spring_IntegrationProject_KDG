from app.database import DatabaseManager
from app.services.chatbot_service import ChatbotService
from app.services.frequently_asked_service import FAQService
from app.services.model_service import ModelService
from app.services.rule_service import RuleService

db_manager : DatabaseManager = None
chatbot_service: ChatbotService = None
faq_service : FAQService = None
rule_service : RuleService = None
model_service : ModelService = None

def initialize_singletons():
    global db_manager, chatbot_service, faq_service, rule_service, model_service

    # Initialize the database instance
    db_manager = DatabaseManager()
    db_manager.seed_database()

    # Initialize the chatbot service
    chatbot_service = ChatbotService(db_manager=db_manager)

    # Initialize the FAQ service
    faq_service = FAQService(db_manager=db_manager)

    # Initialize the rule service
    rule_service = RuleService(db_manager=db_manager)

    # Initialize the model service
    model_service = ModelService()

def get_chatbot_service():
    return chatbot_service

def get_faq_service():
    return faq_service

def get_rule_service():
    return rule_service

def get_model_service():
    return model_service