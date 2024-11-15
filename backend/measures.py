import pandas as pd
import utils


def get_latest_values_by_tickers(tickers=None):
    _df_basic_info = utils.get_data("stocks-basic-info")
    _df_history = utils.get_data("stocks-history", dates_to_parse=["DATE"])
    _df_fundaments = utils.get_data(
        "stocks-fundaments", dates_to_parse=["DT_INI_EXERC", "DT_FIM_EXERC"]
    )
    _df_right_prices = utils.get_data("stocks-right-prices")

    if tickers is not None:
        _df_basic_info["MAIN_TICKER"] = _df_basic_info["TICKERS"].apply(
            lambda x: utils.get_main_ticker(x)
        )
        _df_basic_info = _df_basic_info[_df_basic_info["MAIN_TICKER"].isin(tickers)]

        _df_right_prices = _df_right_prices[_df_right_prices["TICKER"].isin(tickers)]

    cds_cvm = _df_basic_info["CD_CVM"].values

    df_fundaments_tmp = _df_fundaments[_df_fundaments["CD_CVM"].isin(cds_cvm)]
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

    df_history_tmp = _df_history[_df_history["CD_CVM"].isin(cds_cvm)]
    last_history_date = df_history_tmp.groupby("CD_CVM")["DATE"].max().reset_index()
    df_history_tmp = df_history_tmp.merge(
        last_history_date, how="inner", on=["CD_CVM", "DATE"]
    ).drop("DATE", axis=1)

    df_latest_values = (
        df_fundaments_tmp.merge(df_history_tmp, on="CD_CVM")
        .merge(_df_right_prices, on=["CD_CVM", "TICKER"])
        .merge(_df_basic_info[["CD_CVM", "NUM_TOTAL"]], on="CD_CVM")
    )

    df_latest_values["MARKET_CAP"] = (
        df_latest_values["PRICE"] * df_latest_values["NUM_TOTAL"]
    )

    df_latest_values = df_latest_values.drop("NUM_TOTAL", axis=1)

    return df_latest_values


def get_companies():
    df_basic = utils.get_data("stocks-basic-info")[
        ["CD_CVM", "DENOM_COMERC", "SEGMENTO"]
    ]
    df_latest = get_latest_values_by_tickers()

    df = df_latest.merge(df_basic, on="CD_CVM")
    df = df[["TICKER", "DENOM_COMERC", "SEGMENTO", "MARKET_CAP", "PL", "NET_MARGIN"]]
    df.columns = ["ticker", "name", "segment", "marketCap", "pl", "netMargin"]

    return df
