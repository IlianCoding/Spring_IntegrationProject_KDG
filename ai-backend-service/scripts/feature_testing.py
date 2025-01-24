import numpy as np

from sklearn.feature_selection import mutual_info_regression

def calculate_entropy(values):
    """
    Calculate entropy for a given array of class labels.
    """
    values = values.astype(int)
    probabilities = np.bincount(values) / len(values)
    probabilities = probabilities[probabilities > 0]  # Avoid log(0)
    return -np.sum(probabilities * np.log2(probabilities))


def calculate_information_gain(feature, target):
    """
    Calculate information gain for a single feature.
    """
    total_entropy = calculate_entropy(target)
    unique_values, counts = np.unique(feature, return_counts=True)

    # Weighted entropy for each unique value in the feature
    weighted_entropy = 0
    for value, count in zip(unique_values, counts):
        subset_target = target[feature == value]
        weighted_entropy += (count / len(feature)) * calculate_entropy(subset_target)

    # Information Gain
    return total_entropy - weighted_entropy


def calculate_feature_relevance(data, one_hot_columns, feature_columns):
    """
    Calculates the correlation matrix and mutual information regression scores for a dataset.

    Parameters:
        data (DataFrame): The input dataset.
        one_hot_columns (list): List of one-hot-encoded target columns.
        feature_columns (list): List of feature columns.

    Returns:
        correlation_matrix (DataFrame): Correlation matrix of features vs. one-hot-encoded columns.
        mutual_info_scores (dict): Dictionary of mutual information scores for each one-hot column.
    """
    # Calculate correlation matrix
    correlation_matrix = data[feature_columns + one_hot_columns].corr().loc[feature_columns, one_hot_columns]

    # Calculate mutual information regression
    mutual_info_scores = {}
    for one_hot_col in one_hot_columns:
        mi_scores = mutual_info_regression(data[feature_columns], data[one_hot_col])
        mutual_info_scores[one_hot_col] = dict(zip(feature_columns, mi_scores))

    return correlation_matrix, mutual_info_scores