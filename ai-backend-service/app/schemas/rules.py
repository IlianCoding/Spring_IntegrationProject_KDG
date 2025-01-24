from pydantic import BaseModel

class RuleBase(BaseModel):
    section: str
    text: str
    language: str

class RuleCreate(RuleBase):
    pass

class Rule(RuleBase):
    id: int

    class Config:
        from_attributes = True