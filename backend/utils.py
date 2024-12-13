import pandas as pd
import numpy as np
import math
from os import path
import mappings


def get_data(file_name):
    if file_name == "stocks-fundaments":
        dates_to_parse = ["DT_INI_EXERC", "DT_FIM_EXERC"]
    elif file_name == "stocks-history":
        dates_to_parse = ["DATE"]
    elif file_name == "ipca":
        dates_to_parse = ["DATE"]
    else:
        dates_to_parse = []

    return pd.read_csv(
        path.join(
            path.dirname(__file__).replace("/backend", "/"),
            f"data/processed/{file_name}.csv",
        ),
        parse_dates=dates_to_parse,
    )


def is_kpi_fundaments(kpi):
    if kpi in [
        "CAGR_5_YEARS_PROFIT",
        "CAGR_5_YEARS_REVENUE",
        "DEBT",
        "DEBT_NET",
        "EBIT",
        "EQUITY",
        "NET_DEBT_BY_EBIT",
        "NET_DEBT_BY_EQUITY",
        "NET_MARGIN",
        "NET_REVENUE",
        "PROFIT",
        "ROE",
    ]:
        return True
    else:
        return False


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
    return df.rename(columns=mappings.kpi_renaming)


def get_kpi_original_name(kpi):
    kpi_mapping_inverse = {v: k for k, v in mappings.kpi_renaming.items()}

    return kpi_mapping_inverse[kpi]


def get_df_stocks_cleaned(df, return_cols):
    useful_return_cols = return_cols.copy()

    for col in return_cols:
        if col not in df.columns:
            useful_return_cols.remove(col)

    df = df[useful_return_cols]
    df = columns_rename(df)

    return df


def get_company_by_ticker(df_basic_info, ticker):
    return df_basic_info[df_basic_info["TICKERS"].str.contains(ticker)].iloc[0]


def get_cd_cvm_by_ticker(df_basic_info, ticker):
    return get_company_by_ticker(df_basic_info, ticker)["CD_CVM"]


def get_segment_by_ticker(df_basic_info, ticker):
    return get_company_by_ticker(df_basic_info, ticker)["SEGMENTO"]


def get_companies_by_segment(df_basic_info, segment):
    df_tmp = df_basic_info[df_basic_info["SEGMENTO"] == segment].copy()
    df_tmp["MAIN_TICKER"] = df_tmp["TICKERS"].apply(get_main_ticker)
    return df_tmp[["CD_CVM", "NOME", "MAIN_TICKER", "FOUNDATION"]]


def get_ipca_weights(dates):
    df_ipca = get_data("ipca")

    df_ipca["DATE"] = df_ipca["DATE"].dt.to_period("M")

    kpi_periods = dates.dt.to_period("M").values

    df_ipca = df_ipca[df_ipca["DATE"].isin(kpi_periods)]

    last_ipca_value = df_ipca["VALUE"].iloc[-1]

    weights = last_ipca_value / df_ipca["VALUE"]

    return weights.reset_index(drop=True).values


def get_date_weights(dates):
    days_diff = (dates.max() - dates.min()).days
    weights = (days_diff - (dates.max() - dates).dt.days) / days_diff

    return np.exp(weights.reset_index(drop=True).values)


def get_number_length(number):
    length = abs(int(math.log10(abs(number))))

    if number < 0:
        length += 1

    return length
