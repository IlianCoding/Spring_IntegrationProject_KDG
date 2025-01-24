import joblib
import logging
import numpy as np

from os import path

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class ModelService:
    ALL_DOMAINS = [
        'Strategy Games', 'Thematic Games', 'Wargames', 'Family Games', 'Customizable Games',
        "Children's Games", 'Abstract Games', 'Party Games'
    ]
    ALL_MECHANICS = [
        'Specialized Mechanics', 'Interaction and Conflict', 'Strategic Elements', 'Other',
        'Game Progression and Mechanics', 'Action and Turn Management', 'Resource Management',
        'Auxiliary Mechanics', 'Movement and Positioning', 'Narrative and Thematic'
    ]
    def __init__(self):
        base_dir = path.dirname(path.abspath(__file__))
        self.rating_average_model_path = path.join(base_dir, "..", "saved_models", "rating_average_model.pkl")
        self.complexity_average_model_path = path.join(base_dir, "..", "saved_models", "complexity_average_model.pkl")
        self.owned_users_model_path = path.join(base_dir, "..", "saved_models", "owned_users_model.pkl")

        self.scaler_average_rating_path = path.join(base_dir, "..", "saved_models", "rating_average_scaler.pkl")
        self.scaler_complexity_average_path = path.join(base_dir, "..", "saved_models", "complexity_average_scaler.pkl")
        self.scaler_owned_users_path = path.join(base_dir, "..", "saved_models", "owned_users_scaler.pkl")

        self.average_rating_model = self._load_model(self.rating_average_model_path)
        self.complexity_average_model = self._load_model(self.complexity_average_model_path)
        self.owned_users_model = self._load_model(self.owned_users_model_path)

        self.scaler_average_rating = self._load_model(self.scaler_average_rating_path)
        self.scaler_complexity_average = self._load_model(self.scaler_complexity_average_path)
        self.scaler_owned_users = self._load_model(self.scaler_owned_users_path)

    @staticmethod
    def _load_model(model_path):
        if not path.exists(model_path):
            logger.error(f"Model file not found at path: {model_path}")
            raise FileNotFoundError(f"Model file not found: {model_path}")
        logger.info(f"Loading model from {model_path} was successful")
        try:
            return joblib.load(model_path)
        except Exception as e:
            logger.error(f"Error loading model at {model_path}: {str(e)}")
            raise

    @staticmethod
    def _multi_encode(items, all_options):
        try:
            logger.debug(f"Encoding items: {items} based on options: {all_options}")
            result = np.array([1 if option in items else 0 for option in all_options])
            logger.debug(f"Encoded vector: {result}")
            return result
        except Exception as e:
            logger.error(f"Error during multi-hot encoding for items: {items}. Error: {str(e)}")
            raise ValueError(f"Error during encoding: {str(e)}")

    @staticmethod
    def _prepare_model_input(request_data, order):
        try:
            logger.debug(f"Preparing input with data: {request_data} and order: {order}")
            result = np.array([request_data[feature] for feature in order])
            logger.debug(f"Prepared model input: {result}")
            return result
        except KeyError as e:
            logger.error(f"Missing feature during input preparation: {str(e)}")
            raise KeyError(f"Missing feature: {str(e)}")
        except Exception as e:
            logger.error(f"Error preparing model input: {str(e)}")
            raise

    @staticmethod
    def _safe_predict(model, input_data):
        try:
            logger.info(f"Running prediction with input: {input_data}")
            prediction = model.predict(input_data)[0]
            logger.info(f"Prediction successful: {prediction}")
            return prediction
        except Exception as e:
            logger.error(f"Error during prediction: {str(e)}")
            raise RuntimeError(f"Prediction failed: {str(e)}")

    def predict_average_rating(self, average_rating_request):
        try:
            logger.info(f"Processing average rating request: {average_rating_request}")
            mechanics_encoded = self._multi_encode(average_rating_request['mechanics'], self.ALL_MECHANICS)
            model_input = self._prepare_model_input(
                {
                    **average_rating_request,
                    **dict(zip(self.ALL_MECHANICS, mechanics_encoded))
                },
                self.ALL_MECHANICS + ['min_age', 'users_rated', 'play_time']
            )
            return self._safe_predict(self.average_rating_model, self.scaler_average_rating.transform([model_input]))
        except Exception as e:
            logger.error(f"Error processing average rating request: {str(e)}")
            raise

    def predict_complexity_average(self, complexity_rating_request):
        try:
            logger.info(f"Processing complexity average request: {complexity_rating_request}")
            mechanics_encoded = self._multi_encode(complexity_rating_request['mechanics'], self.ALL_MECHANICS)
            domains_encoded = self._multi_encode(complexity_rating_request['domains'], self.ALL_DOMAINS)
            model_input = self._prepare_model_input(
                {
                    **complexity_rating_request,
                    **dict(zip(self.ALL_MECHANICS, mechanics_encoded)),
                    **dict(zip(self.ALL_DOMAINS, domains_encoded))
                },
                ['play_time', 'min_age', 'rating_average'] + self.ALL_DOMAINS + self.ALL_MECHANICS
            )
            return self._safe_predict(self.complexity_average_model, self.scaler_complexity_average.transform([model_input]))
        except Exception as e:
            logger.error(f"Error processing complexity average request: {str(e)}")
            raise

    def predict_owned_users(self, owned_users_request):
        try:
            logger.info(f"Processing owned users request: {owned_users_request}")
            mechanics_encoded = self._multi_encode(owned_users_request['mechanics'], self.ALL_MECHANICS)
            domains_encoded = self._multi_encode(owned_users_request['domains'], self.ALL_DOMAINS)
            model_input = self._prepare_model_input(
                {
                    **owned_users_request,
                    **dict(zip(self.ALL_MECHANICS, mechanics_encoded)),
                    **dict(zip(self.ALL_DOMAINS, domains_encoded))
                },
                self.ALL_MECHANICS + ['min_age', 'rating_average', 'users_rated'] + self.ALL_DOMAINS
            )
            return self._safe_predict(self.owned_users_model, self.scaler_owned_users.transform([model_input]))
        except Exception as e:
            logger.error(f"Error processing owned users request: {str(e)}")
            raise