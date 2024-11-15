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
