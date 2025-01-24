import logging

from typing import List
from werkzeug.exceptions import HTTPException

from app.database import DatabaseManager
from app.schemas.rules import Rule, RuleCreate

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class RuleService:
    def __init__(self, db_manager: DatabaseManager):
        self.db_manager = db_manager

    def get_rules(self) -> List[Rule]:
        logger.info("Getting all rules")
        return self.db_manager.get_rules()

    def create_rule(self, rule: RuleCreate) -> Rule:
        logger.info("Creating rule")
        return self.db_manager.add_rule(rule)

    async def delete_rule(self, rule_id: int) -> bool:
        logger.info(f"Deleting rule with id: {rule_id}")
        success = self.db_manager.remove_rule(rule_id)
        if not success:
            logger.error(f"Rule with ID {rule_id} not found.")
            raise HTTPException(status_code=404, detail="Rule not found")
        return success