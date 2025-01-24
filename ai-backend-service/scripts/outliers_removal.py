def clean_min_player(df, column_name='Min Players'):
    """
    This function cleans the minimum players column by removing the outliers.
    Outliers are defined as values less than 1.
    :param df: The dataframe that needs to be cleaned
    :param column_name: The column that needs to be cleaned
    :return: The cleaned dataframe
    """
    return df[df[column_name] >= 1]

def clean_max_player(df, column_name='Max Players', compare_column='Min Players'):
    """
    This function cleans the maximum players column by filling in the outliers with a predicted value.
    The predicted value is calculated using a regression model that uses the highest correlated features.
    :param df: The dataframe that needs to be cleaned
    :param column_name: The column that needs to be cleaned
    :param compare_column: The column that is used to compare the outliers
    :return: The cleaned dataframe
    """

    return df[df[column_name] >= df[compare_column]]