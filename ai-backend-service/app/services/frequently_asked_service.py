import logging

from app.database import DatabaseManager

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class FAQService:
    def __init__(self, db_manager: DatabaseManager):
        self.db_manager = db_manager

    async def get_top_faq_questions(self, limit: int = 5):
        """
        Returning the most frequently asked questions.
        :param limit: The number of questions to return
        :return: The most frequently asked questions
        """
        return self.db_manager.get_top_faq_questions(limit)