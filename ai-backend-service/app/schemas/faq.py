from pydantic import BaseModel, ConfigDict

class FAQBase(BaseModel):
    question: str
    answer: str
    language: str

    model_config =  ConfigDict(arbitrary_types_allowed=True)

class FAQCreate(FAQBase):
    pass

class Faq(FAQBase):
    id: int

    class Config:
        from_attributes = True