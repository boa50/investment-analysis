import pandas as pd
import utils


def _clear_df_segment(
    df_segment: pd.DataFrame, value_column: str, group_segment_values: bool = True
):
    if group_segment_values:
        df_segment = df_segment.groupby("DATE")[value_column].mean().reset_index()
        df_segment["CD_CVM"] = -1
        df_segment["TICKER"] = "SEGMENT"

    if "TICKER" not in df_segment.columns:
        df_basic_info = utils.get_data("stocks-basic-info")
        df_segment = df_segment.merge(
            df_basic_info[["CD_CVM", "TICKERS"]], how="left", on="CD_CVM"
        )
        df_segment["TICKERS"] = df_segment["TICKERS"].str[:4]
        df_segment = df_segment.rename(columns={"TICKERS": "TICKER"})

    df_segment = df_segment[["CD_CVM", "TICKER", "DATE", value_column]]
    df_segment = df_segment.sort_values(by="DATE")

    return df_segment


def _get_kpi_fundaments_segment(
    df_basic_info, segment, df_kpi, value_column, group_segment_values=True
):
    cd_cvm_segment = utils.get_companies_by_segment(
        df_basic_info=df_basic_info, segment=segment
    )["CD_CVM"].values

    df_segment = df_kpi[df_kpi["CD_CVM"].isin(cd_cvm_segment)]
    df_segment = _clear_df_segment(
        df_segment=df_segment,
        value_column=value_column,
        group_segment_values=group_segment_values,
    )

    return df_segment


def _get_kpi_history_segment(
    df_basic_info, segment, df_history, kpi, group_segment_values=True
):
    tickers_segment = utils.get_companies_by_segment(
        df_basic_info=df_basic_info, segment=segment
    )["MAIN_TICKER"].values

    df_segment = df_history[df_history["TICKER"].isin(tickers_segment)]
    df_segment = df_segment = _clear_df_segment(
        df_segment=df_segment,
        value_column=kpi,
        group_segment_values=group_segment_values,
    )

    return df_segment


def _get_kpi_fundaments(
    ticker, kpi, n_years=10, is_from_segment=False, group_segment_values=True
):
    df_basic_info = utils.get_data("stocks-basic-info")
    df_fundaments = utils.get_data("stocks-fundaments")

    df_kpi = df_fundaments.copy()

    if not is_from_segment:
        cd_cvm = utils.get_cd_cvm_by_ticker(df_basic_info=df_basic_info, ticker=ticker)
        df_kpi = df_kpi[df_kpi["CD_CVM"] == cd_cvm]

    df_kpi = df_kpi[df_kpi["KPI"] == kpi]
    df_kpi = df_kpi[df_kpi["DT_YEAR"] >= df_kpi["DT_YEAR"].max() - n_years]

    value_column = (
        "VALUE"
        if df_kpi["VALUE_ROLLING_YEAR"].max() == -1
        else "VALUE_ROLLING_YEAR"
    )
    
    if value_column == "VALUE_ROLLING_YEAR":
        df_kpi = df_kpi.drop("VALUE", axis=1)

    df_kpi = df_kpi.rename(columns={"DT_END": "DATE", value_column: "VALUE"})
    if is_from_segment:
        df_kpi = _get_kpi_fundaments_segment(
            df_basic_info=df_basic_info,
            segment=utils.get_segment_by_ticker(
                df_basic_info=df_basic_info, ticker=ticker
            ),
            df_kpi=df_kpi,
            value_column="VALUE",
            group_segment_values=group_segment_values,
        )

    if not is_from_segment:
        df_kpi = df_kpi.merge(
            df_basic_info[["CD_CVM", "TICKERS"]], how="left", on="CD_CVM"
        )
        df_kpi["TICKERS"] = df_kpi["TICKERS"].str[:4]
        df_kpi = df_kpi.rename(columns={"TICKERS": "TICKER"})

    df_kpi = df_kpi[["DATE", "CD_CVM", "TICKER", "VALUE"]]

    return df_kpi


def _get_kpi_history(
    ticker, kpi, n_years=10, is_from_segment=False, group_segment_values=True
):
    df_basic_info = utils.get_data("stocks-basic-info")
    df_history = utils.get_data("stocks-history")

    if is_from_segment:
        df_kpi = _get_kpi_history_segment(
            df_basic_info=df_basic_info,
            segment=utils.get_segment_by_ticker(
                df_basic_info=df_basic_info, ticker=ticker
            ),
            df_history=df_history,
            kpi=kpi,
            group_segment_values=group_segment_values,
        )
    else:
        df_kpi = df_history[df_history["TICKER"] == ticker]

    df_kpi = df_kpi[["DATE", "CD_CVM", "TICKER", kpi]]
    df_kpi = df_kpi.rename(columns={kpi: "VALUE"})
    first_date = df_kpi["DATE"].max() - pd.DateOffset(years=n_years)
    df_kpi = df_kpi[df_kpi["DATE"] >= first_date]

    return df_kpi


def get_kpi_values(
    ticker, kpi, n_years=10, is_from_segment=False, group_segment_values=True
):
    if utils.is_kpi_fundaments(kpi=kpi):
        return _get_kpi_fundaments(
            ticker=ticker,
            kpi=kpi,
            n_years=n_years,
            is_from_segment=is_from_segment,
            group_segment_values=group_segment_values,
        )
    else:
        return _get_kpi_history(
            ticker=ticker,
            kpi=kpi,
            n_years=n_years,
            is_from_segment=is_from_segment,
            group_segment_values=group_segment_values,
        )


def get_kpis_latest_values(tickers=None):
    df_basic_info = utils.get_data("stocks-basic-info")
    df_history = utils.get_data("stocks-history")
    df_fundaments = utils.get_data("stocks-fundaments")
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
        df_fundaments_tmp.groupby("CD_CVM")["DT_END"].max().reset_index()
    )

    df_fundaments_tmp = df_fundaments_tmp.merge(
        last_fundament_date, how="inner", on=["CD_CVM", "DT_END"]
    )

    df_fundaments_tmp_2 = df_fundaments_tmp[
        df_fundaments_tmp["VALUE_ROLLING_YEAR"] == -1
    ]
    df_fundaments_tmp = df_fundaments_tmp[
        df_fundaments_tmp["VALUE_ROLLING_YEAR"] != -1
    ]
    df_fundaments_tmp = df_fundaments_tmp.pivot(
        index=["CD_CVM", "DT_END"], columns="KPI", values="VALUE_ROLLING_YEAR"
    ).reset_index()
    df_fundaments_tmp_2 = (
        df_fundaments_tmp_2.pivot(
            index=["CD_CVM", "DT_END"], columns="KPI", values="VALUE"
        )
        .reset_index()
        .drop("CD_CVM", axis=1)
    )

    df_fundaments_tmp = pd.concat([df_fundaments_tmp, df_fundaments_tmp_2], axis=1)
    df_fundaments_tmp = df_fundaments_tmp.drop("DT_END", axis=1)

    df_history_tmp = df_history[df_history["CD_CVM"].isin(cds_cvm)]
    last_history_date = df_history_tmp.groupby("CD_CVM")["DT_EVENT"].max().reset_index()
    df_history_tmp = df_history_tmp.merge(
        last_history_date, how="inner", on=["CD_CVM", "DT_EVENT"]
    ).drop("DT_EVENT", axis=1)

    df_latest_values = (
        df_fundaments_tmp.merge(df_history_tmp, on="CD_CVM")
        .merge(df_right_prices, how="left", on=["CD_CVM", "TICKER"])
        .merge(df_basic_info[["CD_CVM", "NUM_TOTAL", "NAME", "SEGMENT"]], on="CD_CVM")
    )

    df_latest_values["MARKET_CAP"] = (
        df_latest_values["PRICE"] * df_latest_values["NUM_TOTAL"]
    )

    df_latest_values = df_latest_values.drop("NUM_TOTAL", axis=1)

    return df_latest_values
