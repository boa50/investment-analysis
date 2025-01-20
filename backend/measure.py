import numpy as np
import pandas as pd
import utils
import calculations
import mappings
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


def get_stock_ratings(ticker: str, verbose: int = 0):
    def try_get_kpi_rating(ticker, kpi):
        kpi_rating = get_kpi_rating(ticker=ticker, kpi=kpi, verbose=verbose - 2)

        if verbose > 1:
            print(kpi + ": " + str(kpi_rating))

        return kpi_rating

    ratings = {}
    for kpi_group in mappings.kpi_by_group.keys():
        ratings[kpi_group] = 0

    for kpi_group, kpis in mappings.kpi_by_group.items():
        for kpi in kpis:
            ratings[kpi_group] += try_get_kpi_rating(ticker=ticker, kpi=kpi)

        ratings[kpi_group] = ratings[kpi_group] * 100 / len(kpis)

    weights = [0.3, 0.3, 0.2, 0.1] if ratings["debt"] > 0 else [0.4, 0, 0.35, 0.25]

    ratings["overall"] = (np.array(list(ratings.values())) * np.array(weights)).sum()

    if verbose > 0:
        print()
        print(f"{ticker} RATINGS")
        for group, value in ratings.items():
            print(f"{group}: {value}")

    return ratings


def get_kpi_rating(
    ticker: str,
    kpi: str,
    is_time_weighted: bool = True,
    is_inflation_weighted: bool = True,
    verbose: int = -1,
):
    df = get_kpi_values(ticker=ticker, kpi=kpi)

    if (df.size == 0) or (np.sum(df["VALUE"] != 0) == 0):
        return 0

    df = df.dropna(axis=0)

    df_segment_ungrouped = get_kpi_values(
        ticker=ticker, kpi=kpi, is_from_segment=True, group_segment_values=False
    )

    df_segment = get_kpi_values(
        ticker=ticker, kpi=kpi, is_from_segment=True, group_segment_values=False
    )

    weights = utils.get_date_weights(dates=df["DATE"]) if is_time_weighted else None

    if is_inflation_weighted and (kpi in ["PROFIT", "NET_REVENUE", "EBIT", "EQUITY"]):
        inflation_weights = utils.get_ipca_weights(dates=df["DATE"])
        if weights is None:
            weights = inflation_weights
        else:
            weights *= inflation_weights

    if kpi in ["NET_DEBT_BY_EBIT", "NET_DEBT_BY_EQUITY"]:
        thresholds = [3]
    elif kpi in ["DIVIDEND_PAYOUT"]:
        thresholds = [20, 70]
    else:
        thresholds = []

    pain_index = calculations.calculate_kpi_pain_index(
        df=df,
        kpi=kpi,
        df_segment=df_segment,
        thresholds=thresholds,
        weights=weights,
    )

    _, slope = calculations.calculate_trend(
        x=df["DATE"], y=df["VALUE"], sample_weight=weights
    )

    last_value = float(df.iat[-1, -1])

    if verbose > 0:
        print()
        print("get_kpi_rating")
        print(f"pain_index: {pain_index}")
        print(f"slope: {slope}")
        print(f"last_value: {last_value}")

    rating = calculations.calculate_kpi_rating(
        pain_index=pain_index,
        slope=slope,
        last_value=last_value,
        df_segment_ungrouped=df_segment_ungrouped,
        kpi=kpi,
        verbose=verbose - 1,
    )

    return rating
