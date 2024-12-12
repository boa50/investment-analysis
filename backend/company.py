import numpy as np
from unidecode import unidecode
import utils
import datasource


def get_companies():
    df = datasource.get_kpis_latest_values()

    return_cols = ["TICKER", "NOME", "SEGMENTO", "MARKET_CAP", "PL", "NET_MARGIN"]

    df = utils.get_df_stocks_cleaned(df, return_cols)
    df = df.sort_values(by="marketCap", ascending=False)

    return df


def get_company(ticker):
    df = datasource.get_kpis_latest_values([ticker])
    df = df.dropna(axis=1)

    return_cols = [
        "NOME",
        "SEGMENTO",
        "MARKET_CAP",
        "PRICE",
        "BAZIN",
        "PL",
        "PVP",
        "DIVIDEND_YIELD",
        "DIVIDEND_PAYOUT",
        "EQUITY",
        "NET_REVENUE",
        "PROFIT",
        "EBIT",
        "DEBT",
        "DEBT_NET",
        "NET_MARGIN",
        "ROE",
        "NET_DEBT_BY_EBIT",
        "NET_DEBT_BY_EQUITY",
        "CAGR_5_YEARS_PROFIT",
        "CAGR_5_YEARS_REVENUE",
    ]

    df = utils.get_df_stocks_cleaned(df, return_cols)
    df["rating"] = np.random.random(size=df.shape[0]) * 5

    return df


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
