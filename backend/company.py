import pandas as pd
import numpy as np
from unidecode import unidecode
import utils
# import datasource
import queries.general as general
import queries.history as history
import queries.fundaments as fundaments

def pivot_df_fundaments(df_fundaments: pd.DataFrame, is_keep_index=False):
    df_fundaments["REAL_VALUE"] = np.where(
                                    df_fundaments["VALUE_ROLLING_YEAR"] != -1, 
                                    df_fundaments["VALUE_ROLLING_YEAR"], 
                                    df_fundaments["VALUE"])
    if is_keep_index:
        df_fundaments = df_fundaments.pivot_table(index="CD_CVM", values="REAL_VALUE", columns="KPI")
    else:
        df_fundaments = df_fundaments.pivot_table(values="REAL_VALUE", columns="KPI")
        
    df_fundaments = df_fundaments.reset_index(drop=(not is_keep_index))
    
    return df_fundaments

def get_companies():
    df_basic = general.get_basic_info(columns=["CD_CVM", "TICKERS", "NAME", "SEGMENT", "NUM_TOTAL"])
    df_basic["TICKERS"] = df_basic["TICKERS"].str.split(";")
    df_basic = df_basic.explode("TICKERS")
    df_basic = df_basic.rename(columns={"TICKERS": "TICKER"})
    
    df_history = history.get_latest_values(kpis=["PRICE", "PRICE_PROFIT"])
    
    df_fundaments = fundaments.get_latest_values(kpis=["NET_MARGIN"])
    df_fundaments = pivot_df_fundaments(df_fundaments=df_fundaments, is_keep_index=True)
    
    df = df_basic.merge(
            df_history, how="right", on="TICKER"
        ).merge(
            df_fundaments, how="left", on="CD_CVM"
        )
    
    df["MARKET_CAP"] = df["NUM_TOTAL"] * df["PRICE"]
    
    df = df.drop(["CD_CVM", "NUM_TOTAL", "PRICE"], axis=1)
    
    df = utils.columns_rename(df)

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
    df_fundaments = pivot_df_fundaments(df_fundaments=df_fundaments)
    
    df_right_prices = general.get_right_prices(ticker=ticker)
    
    df = pd.concat([df_basic, df_history, df_fundaments, df_right_prices], axis=1)
    
    df["MARKET_CAP"] = df["NUM_TOTAL"] * df["PRICE"]
    df = df.drop("NUM_TOTAL", axis=1)
    df["TICKER"] = ticker

    df = utils.columns_rename(df)

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
            for col in ["NAME", "TICKERS"]
        ]
    )
    df = df_basic_info.loc[mask.any(axis=1)]

    return_cols = ["NAME", "MAIN_TICKER", "SEGMENT"]
    df = utils.get_df_stocks_cleaned(df, return_cols)
    df["rating"] = np.random.random(size=df.shape[0]) * 5

    return df
