from fastapi import APIRouter, HTTPException, Depends

from app.core.initialization import get_model_service
from app.schemas.models import PredictionResponse, AverageRatingRequest, ComplexityRatingRequest, StatisticsRequest, \
    OwnedUsersRequest
from app.services.model_service import ModelService

router = APIRouter()

@router.post("/predict/statistics", response_model=PredictionResponse)
def predict_statistics(request: StatisticsRequest, model_service: ModelService = Depends(get_model_service)):
    try:
        average_rating_request = AverageRatingRequest(
            mechanics=request.mechanics,
            min_age=request.min_age,
            users_rated=request.users_rated,
            play_time=request.play_time
        ).dict()
        prediction_average_rating = model_service.predict_average_rating(average_rating_request)
        complexity_rating_request = ComplexityRatingRequest(
            play_time=request.play_time,
            min_age=request.min_age,
            rating_average=prediction_average_rating,
            domains=request.domains,
            mechanics=request.mechanics
        ).dict()
        prediction_complexity_average = model_service.predict_complexity_average(complexity_rating_request)
        owned_users_request = OwnedUsersRequest(
            mechanics=request.mechanics,
            min_age=request.min_age,
            users_rated=request.users_rated,
            domains=request.domains,
            rating_average=prediction_average_rating
        ).dict()
        prediction_owned_users = model_service.predict_owned_users(owned_users_request)
        total_prediction = PredictionResponse(
            prediction_average_rating=prediction_average_rating,
            prediction_owned_users=prediction_owned_users,
            prediction_complexity_average=prediction_complexity_average
        ).dict()

        return total_prediction
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))