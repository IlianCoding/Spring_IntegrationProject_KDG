import re

def clean_rating(value):
    cleaned_value = re.sub(r'[^0-9.]', '', str(value))
    try:
        return float(cleaned_value)
    except ValueError:
        return None

def clean_rating_column(df, column_name='Rating Average'):
    """
    Converts the Rating Average column to a numerical column
    :param df: The DataFrame to be converted.
    :param column_name: The name of the column to be converted.
    :return: The DataFrame with the updated Year Published column.
    """
    df[column_name] = df[column_name].apply(clean_rating)
    return df