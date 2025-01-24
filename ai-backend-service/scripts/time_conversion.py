import pandas as pd
import numpy as np
import re

def convert_playtime(value):
    if isinstance(value, str):
        value = value.strip().lower()
        if re.search(r'\d+\s*min', value):
            return float(re.search(r'(\d+)', value).group(1))
        elif re.search(r'\b(\d+|two|three|four|five|six|seven|eight|nine|ten)\s*hours?\b', value):
            num = re.search(r'(\d+)', value)
            if num:
                return float(num.group(1)) * 60
            elif 'two' in value:
                return 120.0
        elif re.search(r'\d+\s*minutes?', value):
            return float(re.search(r'(\d+)', value).group(1))
    elif isinstance(value, (int, float)):
        return float(value)
    return np.nan

def convert_playtime_column(df, column_name='Play Time'):
    """
    Converts the Play Time column to a numerical column
    :param df:
    The DataFrame to be converted.
    :param column_name: The name of the column to be converted.
    :return: The DataFrame with the updated Play Time column.
    """
    df[column_name] = df[column_name].apply(convert_playtime)
    return df

def convert_publish_year(df, column_name='Year Published'):
    """
    Converts the Year Published column to a numerical column
    :param df: The DataFrame to be converted.
    :param column_name: The name of the column to be converted.
    :return: The DataFrame with the updated Year Published column.
    """
    df[column_name] = pd.to_numeric(df[column_name], errors='coerce')
    return df