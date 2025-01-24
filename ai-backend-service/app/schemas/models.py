from typing import List
from pydantic import BaseModel

class AverageRatingRequest(BaseModel):
    mechanics: List[str]
    min_age: int
    users_rated: int
    play_time: int

class OwnedUsersRequest(BaseModel):
    mechanics: List[str]
    min_age: int
    rating_average: float
    users_rated: int
    domains: List[str]

class ComplexityRatingRequest(BaseModel):
    play_time: int
    min_age: int
    rating_average: float
    domains: List[str]
    mechanics: List[str]

class StatisticsRequest(BaseModel):
    min_age: int
    users_rated: int
    play_time: int
    domains: List[str]
    mechanics: List[str]

class PredictionResponse(BaseModel):
    prediction_average_rating: float
    prediction_owned_users: float
    prediction_complexity_average: float