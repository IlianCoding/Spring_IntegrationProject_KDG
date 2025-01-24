from fastapi import APIRouter
from fastapi.params import Depends

from app.core.initialization import get_rule_service
from app.database import DatabaseManager
from app.schemas.rules import Rule, RuleCreate
from app.services.rule_service import RuleService

router = APIRouter()
db_manager = DatabaseManager()

@router.get("/", response_model=list[Rule])
async def get_all_rules(
        rule_service : RuleService = Depends(get_rule_service)
):
    return rule_service.get_rules()

@router.post("/add-rule", response_model=Rule)
async def create_rule(
        rule: RuleCreate,
        rule_service : RuleService = Depends(get_rule_service)
):
    return rule_service.create_rule(rule)

@router.delete("/{rule_id}", response_model=bool)
async def delete_rule(
        rule_id: int,
        rule_service : RuleService = Depends(get_rule_service)
):
    return rule_service.delete_rule(rule_id)