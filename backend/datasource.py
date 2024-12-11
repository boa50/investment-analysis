import pandas as pd
import utils


def _clear_df_segment(df_segment, value_column):
    df_segment = df_segment[["DATE", value_column]]
    df_segment = df_segment.groupby("DATE").mean().reset_index()
    df_segment = df_segment.sort_values(by="DATE")
    df_segment["TICKER"] = "SEGMENT"
    df_segment["CD_CVM"] = -1

    return df_segment


def _get_kpi_fundaments_segment(df_basic_info, segment, df_kpi, value_column):
    cd_cvm_segment = utils.get_companies_by_segment(
        df_basic_info=df_basic_info, segment=segment
    )["CD_CVM"].values

    df_segment = df_kpi[df_kpi["CD_CVM"].isin(cd_cvm_segment)]
    df_segment = _clear_df_segment(df_segment=df_segment, value_column=value_column)

    return df_segment


def _get_kpi_history_segment(df_basic_info, segment, df_history, kpi):
    tickers_segment = utils.get_companies_by_segment(
        df_basic_info=df_basic_info, segment=segment
    )["MAIN_TICKER"].values

    df_segment = df_history[df_history["TICKER"].isin(tickers_segment)]
    df_segment = df_segment = _clear_df_segment(df_segment=df_segment, value_column=kpi)

    return df_segment


def _get_kpi_fundaments(ticker, kpi, n_years=10, is_from_segment=False):
    df_basic_info = utils.get_data("stocks-basic-info")
    df_fundaments = utils.get_data("stocks-fundaments")

    df_kpi = df_fundaments.copy()

    if not is_from_segment:
        cd_cvm = utils.get_cd_cvm_by_ticker(df_basic_info=df_basic_info, ticker=ticker)
        df_kpi = df_kpi[df_kpi["CD_CVM"] == cd_cvm]

    df_kpi = df_kpi[df_kpi["KPI"] == kpi]
    df_kpi = df_kpi[df_kpi["EXERC_YEAR"] >= df_kpi["EXERC_YEAR"].max() - n_years]

    value_column = (
        "VL_CONTA"
        if df_kpi["VL_CONTA_ROLLING_YEAR"].max() == -1
        else "VL_CONTA_ROLLING_YEAR"
    )

    df_kpi = df_kpi.rename(columns={"DT_FIM_EXERC": "DATE", value_column: "VALUE"})
    if is_from_segment:
        df_kpi = _get_kpi_fundaments_segment(
            df_basic_info=df_basic_info,
            segment=utils.get_segment_by_ticker(
                df_basic_info=df_basic_info, ticker=ticker
            ),
            df_kpi=df_kpi,
            value_column="VALUE",
        )

    if not is_from_segment:
        df_kpi = df_kpi.merge(
            df_basic_info[["CD_CVM", "TICKERS"]], how="left", on="CD_CVM"
        )
        df_kpi["TICKERS"] = df_kpi["TICKERS"].str[:4]
        df_kpi = df_kpi.rename(columns={"TICKERS": "TICKER"})

    df_kpi = df_kpi[["DATE", "CD_CVM", "TICKER", "VALUE"]]

    return df_kpi


def _get_kpi_history(ticker, kpi, n_years=10, is_from_segment=False):
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
        )
    else:
        df_kpi = df_history[df_history["TICKER"] == ticker]

    df_kpi = df_kpi[["DATE", "CD_CVM", "TICKER", kpi]]
    df_kpi = df_kpi.rename(columns={kpi: "VALUE"})
    first_date = df_kpi["DATE"].max() - pd.DateOffset(years=n_years)
    df_kpi = df_kpi[df_kpi["DATE"] >= first_date]

    return df_kpi


def get_kpi(ticker, kpi, n_years=10, is_from_segment=False):
    if utils.is_kpi_fundaments(kpi=kpi):
        print("FUNDAMENTS")
        return _get_kpi_fundaments(
            ticker=ticker, kpi=kpi, n_years=n_years, is_from_segment=is_from_segment
        )
    else:
        print("HISTORY")
        return _get_kpi_history(
            ticker=ticker, kpi=kpi, n_years=n_years, is_from_segment=is_from_segment
        )


print(get_kpi(ticker="TRPL4", kpi="PL", is_from_segment=True))
