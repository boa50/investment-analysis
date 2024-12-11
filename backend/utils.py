import pandas as pd
import numpy as np
from os import path


def get_data(file_name):
    if file_name == "stocks-fundaments":
        dates_to_parse = ["DT_INI_EXERC", "DT_FIM_EXERC"]
    elif file_name == "stocks-history":
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


kpi_mapping = {
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


def columns_rename(df):
    return df.rename(columns=kpi_mapping)


def get_kpi_original_name(kpi):
    kpi_mapping_inverse = {v: k for k, v in kpi_mapping.items()}

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


def _get_drawdowns(
    risk_calculation_values, drawdown_kpi_multiplier=1, threshold=np.inf
):
    risk_values = np.minimum(
        risk_calculation_values * drawdown_kpi_multiplier,
        threshold * drawdown_kpi_multiplier,
    )
    running_max = np.maximum.accumulate(risk_values)
    drawdowns = ((risk_values - running_max) / running_max) * drawdown_kpi_multiplier

    return drawdowns.fillna(0)


def get_pain_index(
    risk_calculation_values, drawdown_kpi_multiplier=1, threshold=np.inf, weights=None
):
    drawdowns = _get_drawdowns(
        risk_calculation_values=risk_calculation_values,
        drawdown_kpi_multiplier=drawdown_kpi_multiplier,
        threshold=threshold,
    )

    pain_index = np.average(drawdowns, weights=weights)

    return pain_index
