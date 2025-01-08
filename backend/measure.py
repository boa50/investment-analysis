import numpy as np
import utils
import datasource
import calculations
import mappings


def get_historical_values(ticker, kpi, n_years=10):
    try:
        kpi_original = utils.get_kpi_original_name(kpi)
    except Exception:
        kpi_original = kpi

    df_kpi = datasource.get_kpi_values(ticker=ticker, kpi=kpi_original, n_years=n_years)
    
    df_kpi = utils.columns_rename(df_kpi)

    return df_kpi.sort_values(by="date")


def get_kpi_rating(
    ticker: str,
    kpi: str,
    is_time_weighted: bool = True,
    is_inflation_weighted: bool = True,
    verbose: int = -1,
):
    df = datasource.get_kpi_values(ticker=ticker, kpi=kpi)
    df_segment_ungrouped = datasource.get_kpi_values(
        ticker=ticker, kpi=kpi, is_from_segment=True, group_segment_values=False
    )
    df_segment = df_segment_ungrouped.groupby("DATE")["VALUE"].mean().reset_index()

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

    last_value = df.iat[-1, -1]

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


def get_stock_ratings(ticker: str, verbose: int = 0):
    def try_get_kpi_rating(ticker, kpi):
        try:
            kpi_rating = get_kpi_rating(ticker=ticker, kpi=kpi, verbose=verbose - 2)

            if verbose > 1:
                print(kpi + ": " + str(kpi_rating))

            return kpi_rating
        except Exception:
            return 0

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

import os

# DATA_SOURCE=database
# DB_PROJECT_ID=lazy-investor-db
# DB_DATASET_ID=app_dataset

os.environ["DATA_SOURCE"] = "database"
os.environ["DB_PROJECT_ID"] = "lazy-investor-db"
os.environ["DB_DATASET_ID"] = "app_dataset"

get_stock_ratings(ticker="BBAS3", verbose=3)