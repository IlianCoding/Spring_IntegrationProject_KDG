import numpy as np

from catboost import CatBoostRegressor
from lightgbm import LGBMRegressor
from sklearn.base import BaseEstimator, ClassifierMixin
from sklearn.ensemble import RandomForestClassifier, StackingRegressor, RandomForestRegressor
from sklearn.linear_model import Ridge, ElasticNet
from sklearn.metrics import r2_score
from sklearn.model_selection import GridSearchCV
from sklearn.neighbors import KNeighborsRegressor
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import mean_squared_error, mean_absolute_error
from xgboost import XGBClassifier, XGBRegressor

def create_xgb_model(class_weight=None):
    return XGBClassifier(
        device='cuda',
        predictor='gpu_predictor',
        scale_pos_weight=class_weight,
        objective='binary:logistic',
        use_label_encoder=False,
        random_state=42
    )

def catboost_model_tuning(x_train, y_train):
    catboost = CatBoostRegressor(
        iterations=500,
        depth=6,
        learning_rate=0.1,
        loss_function='RMSE',
        random_seed=42,
        verbose=0
    )

    catboost.fit(x_train, y_train)
    return catboost

def elastic_net_model_tuning(x_train, y_train):
    parameter_grid = {
        'alpha': [0.01, 0.1, 1.0, 10.0],
        'l1_ratio': [0.1, 0.5, 0.9]
    }

    elastic_net = ElasticNet(
        random_state=42,
    )

    grid_search = GridSearchCV(
        estimator=elastic_net,
        param_grid=parameter_grid,
        cv=5,
        scoring='neg_mean_squared_error',
        n_jobs=-1,
    )

    grid_search.fit(x_train, y_train)
    return grid_search

def knn_model_tuning(x_train, y_train):
    parameter_grid = {
        'n_neighbors': [3, 5, 7, 10],
        'weights': ['uniform', 'distance'],
        'metric': ['euclidean', 'manhattan']
    }

    knn = KNeighborsRegressor()

    grid_search = GridSearchCV(
        estimator=knn,
        param_grid=parameter_grid,
        cv=5,
        scoring='neg_mean_squared_error',
        n_jobs=-1
    )

    grid_search.fit(x_train, y_train)
    return grid_search.best_estimator_

def random_forest_tuning(x_train, y_train):
    parameter_grid = {
        'n_estimators': [100, 200, 300],
        'max_depth': [None, 10, 20, 30],
        'min_samples_split': [2, 5, 10],
        'min_samples_leaf': [1, 2, 4]
    }

    rf = RandomForestRegressor(random_state=42)

    grid_search = GridSearchCV(
        estimator=rf,
        param_grid=parameter_grid,
        cv=5,
        scoring='neg_mean_squared_error',
        n_jobs=-1,
    )

    grid_search.fit(x_train, y_train)
    return grid_search.best_estimator_

def light_gbm_tuning(x_train, y_train):
    parameter_grid = {
        'n_estimators': [100, 200, 300],
        'max_depth': [None, 10, 20, 30],
        'min_samples_split': [2, 5, 10],
        'min_samples_leaf': [1, 2, 4]
    }

    lgbm = LGBMRegressor(random_state=42)

    grid_search = GridSearchCV(
        estimator=lgbm,
        param_grid=parameter_grid,
        cv=5,
        scoring='neg_mean_squared_error',
        n_jobs=-1,
    )

    grid_search.fit(x_train, y_train)
    return grid_search.best_estimator_

def create_stacked_model(x_train, y_train):
    rf = random_forest_tuning(x_train, y_train)
    light_gbm = light_gbm_tuning(x_train, y_train)
    catboost = catboost_model_tuning(x_train, y_train)
    elastic_net = elastic_net_model_tuning(x_train, y_train)
    knn = knn_model_tuning(x_train, y_train)

    stacked_model = StackingRegressor(
        estimators=[
            ('rf', rf),
            ('light_gbm', light_gbm),
            ('catboost', catboost),
            ('elastic_net', elastic_net),
            ('knn', knn)
        ],
        final_estimator=Ridge(),
        cv=5,
        n_jobs=-1
    )

    stacked_model.fit(x_train, y_train)
    return stacked_model

def evaluate_model(y_true, y_pred):
    mse = mean_squared_error(y_true, y_pred)
    mae = mean_absolute_error(y_true, y_pred)
    r2 = r2_score(y_true, y_pred)

    return mse, mae, r2

class WeightedRandomForest(BaseEstimator, ClassifierMixin):
    def __init__(self,
                 class_weights=None,
                 n_estimators=100,
                 max_depth=None,
                 min_samples_split=2,
                 min_samples_leaf=1,
                 bootstrap=True):
        """
        Initialize the Weighted Random Forest Classifier

        :param class_weights: Dictionary of class weights for each output or None
        :param n_estimators: Number of trees in the forest
        :param max_depth: Maximum depth of the trees
        :param min_samples_split: Minimum number of samples required to split an internal node
        :param min_samples_leaf: Minimum number of samples required to be at a leaf node
        :param bootstrap: Whether bootstrap samples are used when building trees
        """
        self.class_weights = class_weights if class_weights is not None else {}
        self.n_estimators = n_estimators
        self.max_depth = max_depth
        self.min_samples_split = min_samples_split
        self.min_samples_leaf = min_samples_leaf
        self.bootstrap = bootstrap

        self.models = None
        self.classes_ = None
        self.label_encoders_ = None

    def fit(self, X, y):
        """
        Fit RandomForestClassifier for each mechanic (multi-output classification)
        """
        # Ensure y is a 2D array
        if y.ndim == 1:
            y = y.reshape(-1, 1)

        # Initialize label encoders and classes for each output
        self.label_encoders_ = []
        self.classes_ = []
        encoded_y = np.copy(y)

        # Encode each output column
        for i in range(y.shape[1]):
            le = LabelEncoder()
            encoded_y[:, i] = le.fit_transform(y[:, i])
            self.label_encoders_.append(le)
            self.classes_.append(le.classes_)

        self.models = []

        # Iterate over the mechanics (output columns) in the target matrix
        for i in range(encoded_y.shape[1]):
            rf_params = {
                'n_estimators': self.n_estimators,
                'max_depth': self.max_depth,
                'min_samples_split': self.min_samples_split,
                'min_samples_leaf': self.min_samples_leaf,
                'bootstrap': self.bootstrap,
                'class_weight': self.class_weights.get(i, None)
            }

            # Remove None values to use RandomForestClassifier defaults
            rf_params = {k: v for k, v in rf_params.items() if v is not None}

            rf = RandomForestClassifier(**rf_params)
            rf.fit(X, encoded_y[:, i])
            self.models.append(rf)

        return self

    def predict(self, X):
        """
        Predict for each mechanic (multi-output classification)
        """
        # Make predictions for each model (mechanic)
        predictions = np.column_stack([
            self.label_encoders_[i].inverse_transform(
                model.predict(X).astype(int)
            ) for i, model in enumerate(self.models)
        ])
        return predictions

    def predict_proba(self, X):
        """
        Predict probabilities for each mechanic
        """
        probas = [model.predict_proba(X) for model in self.models]
        return probas

    def get_params(self, deep=True):
        """
        Return parameters for this estimator
        """
        return {
            'class_weights': self.class_weights,
            'n_estimators': self.n_estimators,
            'max_depth': self.max_depth,
            'min_samples_split': self.min_samples_split,
            'min_samples_leaf': self.min_samples_leaf,
            'bootstrap': self.bootstrap
        }

    def set_params(self, **params):
        """
        Set parameters for this estimator
        """
        if not params:
            return self
        for key, value in params.items():
            setattr(self, key, value)
        return self