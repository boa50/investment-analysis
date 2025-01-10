import pandas as pd
import numpy as np
from unidecode import unidecode
import utils
import datasource
import queries.general as general
import queries.history as history
import queries.fundaments as fundaments


def get_companies():
    df = datasource.get_kpis_latest_values()

    return_cols = ["TICKER", "NAME", "SEGMENT", "MARKET_CAP", "PRICE_PROFIT", "NET_MARGIN"]

    df = utils.get_df_stocks_cleaned(df, return_cols)
    df = df.sort_values(by="marketCap", ascending=False)

    return df


def get_companies_and_segments():
    df = general.get_basic_info(columns=["TICKERS", "SEGMENT"])

    df["MAIN_TICKER"] = df["TICKERS"].apply(lambda x: utils.get_main_ticker(x))

    return_cols = ["MAIN_TICKER", "SEGMENT"]

    df = utils.get_df_stocks_cleaned(df, return_cols)
    df = df.sort_values(by=["segment", "ticker"], ascending=True)

    return df


def get_company(ticker):
    df_basic = general.get_basic_info(ticker=ticker, columns=["NAME", "SEGMENT", "NUM_TOTAL"])
    
    df_history = history.get_latest_values(ticker=ticker)
    
    df_fundaments = fundaments.get_latest_values(ticker=ticker)
    df_fundaments["REAL_VALUE"] = np.where(
                                    df_fundaments["VALUE_ROLLING_YEAR"] != -1, 
                                    df_fundaments["VALUE_ROLLING_YEAR"], 
                                    df_fundaments["VALUE"])
    df_fundaments = df_fundaments.pivot_table(values="REAL_VALUE", columns="KPI")
    df_fundaments = df_fundaments.reset_index(drop=True)
    
    df = pd.concat([df_basic, df_history, df_fundaments], axis=1)
    
    df["MARKET_CAP"] = df["NUM_TOTAL"] * df["PRICE"]
    df = df.drop("NUM_TOTAL", axis=1)
    df["TICKER"] = ticker
    
    df["BAZIN"] = 0

    # return_cols = [
    #     "TICKER",
    #     "NOME",
    #     "SEGMENTO",
    #     "MARKET_CAP",
    #     "PRICE",
    #     "BAZIN", ### must query this as well
    #     "PL",
    #     "PVP",
    #     "DIVIDEND_YIELD",
    #     "DIVIDEND_PAYOUT",
    #     "EQUITY",
    #     "NET_REVENUE",
    #     "PROFIT",
    #     "EBIT",
    #     "DEBT",
    #     "DEBT_NET",
    #     "NET_MARGIN",
    #     "ROE",
    #     "NET_DEBT_BY_EBIT",
    #     "NET_DEBT_BY_EQUITY",
    #     "CAGR_5_YEARS_PROFIT",
    #     "CAGR_5_YEARS_REVENUE",
    # ]

    df = utils.columns_rename(df)

    return df
    
print(get_company('BBAS3'))


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
            for col in ["NAME", "TICKERS"]
        ]
    )
    df = df_basic_info.loc[mask.any(axis=1)]

    return_cols = ["NAME", "MAIN_TICKER", "SEGMENT"]
    df = utils.get_df_stocks_cleaned(df, return_cols)
    df["rating"] = np.random.random(size=df.shape[0]) * 5

    return df
