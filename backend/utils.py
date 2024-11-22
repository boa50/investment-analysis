import pandas as pd
from os import path


def get_data(file_name, dates_to_parse=[]):
    return pd.read_csv(
        path.join(
            path.dirname(__file__).replace("/backend", "/"),
            f"data/processed/{file_name}.csv",
        ),
        parse_dates=dates_to_parse,
    )


def get_main_ticker(tickers):
    tickers = tickers.split(";")

    for ticker in tickers:
        if ticker[4] == "4":
            return ticker

    for ticker in tickers:
        if ticker[4] == "3":
            return ticker

    return tickers[0]


def columns_rename(df):
    return df.rename(
        columns={
            "TICKER": "ticker",
            "MAIN_TICKER": "ticker",
            "TICKERS": "tickers",
            "NOME": "name",
            "SEGMENTO": "segment",
            "MARKET_CAP": "marketCap",
            "PRICE": "price",
            "BAZIN": "bazinPrice",
            "PL": "pl",
            "PVP": "pvp",
            "DIVIDEND_YIELD": "dividendYield",
            "DIVIDEND_PAYOUT": "dividendPayout",
            "EQUITY": "equity",
            "NET_REVENUE": "netRevenue",
            "PROFIT": "profit",
            "EBIT": "ebit",
            "DEBT": "debt",
            "DEBT_NET": "netDebt",
            "NET_MARGIN": "netMargin",
            "ROE": "roe",
            "NET_DEBT_BY_EBIT": "netDebtByEbit",
            "NET_DEBT_BY_EQUITY": "netDebtByEquity",
            "CAGR_5_YEARS_PROFIT": "cagr5YearsProfit",
            "CAGR_5_YEARS_REVENUE": "cagr5YearsRevenue",
        }
    )


def get_df_stocks_cleaned(df, return_cols):
    useful_return_cols = return_cols.copy()

    for col in return_cols:
        if col not in df.columns:
            useful_return_cols.remove(col)

    df = df[useful_return_cols]
    df = columns_rename(df)

    return df
