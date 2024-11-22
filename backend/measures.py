import pandas as pd
import utils


def get_latest_values_by_tickers(tickers=None):
    df_basic_info = utils.get_data("stocks-basic-info")
    df_history = utils.get_data("stocks-history", dates_to_parse=["DATE"])
    df_fundaments = utils.get_data(
        "stocks-fundaments", dates_to_parse=["DT_INI_EXERC", "DT_FIM_EXERC"]
    )
    df_right_prices = utils.get_data("stocks-right-prices")

    if tickers is not None:
        df_basic_info["MAIN_TICKER"] = df_basic_info["TICKERS"].apply(
            lambda x: utils.get_main_ticker(x)
        )
        df_basic_info = df_basic_info[df_basic_info["MAIN_TICKER"].isin(tickers)]

        df_right_prices = df_right_prices[df_right_prices["TICKER"].isin(tickers)]

    cds_cvm = df_basic_info["CD_CVM"].values

    df_fundaments_tmp = df_fundaments[df_fundaments["CD_CVM"].isin(cds_cvm)]
    last_fundament_date = (
        df_fundaments_tmp.groupby("CD_CVM")["DT_FIM_EXERC"].max().reset_index()
    )

    df_fundaments_tmp = df_fundaments_tmp.merge(
        last_fundament_date, how="inner", on=["CD_CVM", "DT_FIM_EXERC"]
    )

    df_fundaments_tmp_2 = df_fundaments_tmp[
        df_fundaments_tmp["VL_CONTA_ROLLING_YEAR"] == -1
    ]
    df_fundaments_tmp = df_fundaments_tmp[
        df_fundaments_tmp["VL_CONTA_ROLLING_YEAR"] != -1
    ]
    df_fundaments_tmp = df_fundaments_tmp.pivot(
        index=["CD_CVM", "DT_FIM_EXERC"], columns="KPI", values="VL_CONTA_ROLLING_YEAR"
    ).reset_index()
    df_fundaments_tmp_2 = (
        df_fundaments_tmp_2.pivot(
            index=["CD_CVM", "DT_FIM_EXERC"], columns="KPI", values="VL_CONTA"
        )
        .reset_index()
        .drop("CD_CVM", axis=1)
    )

    df_fundaments_tmp = pd.concat([df_fundaments_tmp, df_fundaments_tmp_2], axis=1)
    df_fundaments_tmp = df_fundaments_tmp.drop("DT_FIM_EXERC", axis=1)

    df_history_tmp = df_history[df_history["CD_CVM"].isin(cds_cvm)]
    last_history_date = df_history_tmp.groupby("CD_CVM")["DATE"].max().reset_index()
    df_history_tmp = df_history_tmp.merge(
        last_history_date, how="inner", on=["CD_CVM", "DATE"]
    ).drop("DATE", axis=1)

    df_latest_values = (
        df_fundaments_tmp.merge(df_history_tmp, on="CD_CVM")
        .merge(df_right_prices, how="left", on=["CD_CVM", "TICKER"])
        .merge(df_basic_info[["CD_CVM", "NUM_TOTAL", "NOME", "SEGMENTO"]], on="CD_CVM")
    )

    df_latest_values["MARKET_CAP"] = (
        df_latest_values["PRICE"] * df_latest_values["NUM_TOTAL"]
    )

    df_latest_values = df_latest_values.drop("NUM_TOTAL", axis=1)

    return df_latest_values


def get_companies():
    df = get_latest_values_by_tickers()

    return_cols = ["TICKER", "NOME", "SEGMENTO", "MARKET_CAP", "PL", "NET_MARGIN"]

    df = utils.get_df_stocks_cleaned(df, return_cols)
    df = df.sort_values(by="marketCap", ascending=False)

    return df


def get_company(ticker):
    df = get_latest_values_by_tickers([ticker])
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

    return df
