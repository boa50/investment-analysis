import pandas as pd
import utils
import mappings
import queries.general as general
import queries.history as history
import queries.fundaments as fundaments


def get_kpi_values(
    ticker, kpi, n_years=10, is_from_segment=False, group_segment_values=True
):
    table_origin = mappings.kpi_table_origin[kpi]

    if table_origin == "fundaments":
        return fundaments.get_kpi(
            kpi=kpi,
            ticker=ticker,
            n_years=n_years,
            is_from_segment=is_from_segment,
            group_segment_values=group_segment_values,
        )
    elif table_origin == "history":
        return history.get_kpi(
            kpi=kpi,
            ticker=ticker,
            n_years=n_years,
            is_from_segment=is_from_segment,
            group_segment_values=group_segment_values,
        )
    else:
        return pd.DataFrame()


def get_historical_values(ticker, kpi, n_years=10):
    try:
        kpi_original = utils.get_kpi_original_name(kpi)
    except Exception:
        kpi_original = kpi

    df = get_kpi_values(ticker=ticker, kpi=kpi_original, n_years=n_years)

    df = utils.columns_rename(df)

    return df


def get_stock_ratings(ticker: str):
    df = general.get_ratings_by_ticker(ticker)

    df = utils.columns_rename(df)

    return df
