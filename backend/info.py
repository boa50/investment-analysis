import numpy as np
from unidecode import unidecode
import utils


def search_companies(text):
    df_basic_info = utils.get_data("stocks-basic-info")

    df_basic_info["MAIN_TICKER"] = df_basic_info["TICKERS"].apply(
        lambda x: utils.get_main_ticker(x)
    )

    decoded_text = unidecode(text)

    mask = np.column_stack(
        [
            df_basic_info[col]
            .apply(unidecode)
            .str.contains(decoded_text, case=False, na=False)
            for col in ["NOME", "TICKERS"]
        ]
    )
    df = df_basic_info.loc[mask.any(axis=1)]

    return_cols = ["NOME", "MAIN_TICKER", "SEGMENTO"]
    df = utils.get_df_stocks_cleaned(df, return_cols)
    df["rating"] = np.random.random(size=df.shape[0]) * 5

    return df
