import numpy as np
import pandas as pd

from sklearn.utils import compute_class_weight

def calculate_one_hot_class_weights(encoded_classes):
    """
    This function calculates the class weights for one hot encoded classes.
    :param encoded_classes: The one hot encoded classes that need to be used to calculate the class weights.
    :return: This returns the class weights for the given one hot encoded classes.
    """

    if isinstance(encoded_classes, pd.DataFrame):
        total_samples = encoded_classes.shape[0]
        num_classes = encoded_classes.shape[1]
        weights = {}
        for col in encoded_classes.columns:
            class_count = encoded_classes[col].sum()
            if class_count > 0:
                weights[col] = total_samples / (num_classes * class_count)
            else:
                weights[col] = 0
    else:
        total_samples = encoded_classes.shape[0]
        num_classes = encoded_classes.shape[1]
        weights = {}
        for col in range(num_classes):
            class_count = np.sum(encoded_classes[:, col])
            if class_count > 0:
                weights[col] = total_samples / (num_classes * class_count)
            else:
                weights[col] = 0

    return weights

def calculate_binary_matrix_class_weights(encoded_classes):
    """
    This function calculates the class weights for training the custom mechanics imputing model.
    :param encoded_classes: The encoded mechanics matrix.
    :return: This returns the class weights for the given encoded mechanics.
    """

    mechanics_weights = {}
    for col in range(encoded_classes.shape[1]):
        class_weights = compute_class_weight(
            class_weight='balanced',
            classes=np.unique(encoded_classes[:, col]),
            y=encoded_classes[:, col]
        )
        mechanics_weights[col] = {0: class_weights[0], 1: class_weights[1]}

    return mechanics_weights