import utils
import datasource
import calculations


def get_historical_values(ticker, kpi, n_years=10):
    try:
        kpi_original = utils.get_kpi_original_name(kpi)
    except Exception:
        kpi_original = kpi

    df_kpi = datasource.get_kpi_values(ticker=ticker, kpi=kpi_original, n_years=n_years)

    df_kpi = df_kpi.rename(
        columns={
            "DATE": "date",
            "CD_CVM": "cdCvm",
            "TICKER": "ticker",
            "VALUE": "value",
        }
    )

    return df_kpi


def get_kpi_rating(
    ticker,
    kpi,
    is_time_weighted=True,
    is_inflation_weighted=True,
):
    df = datasource.get_kpi_values(ticker=ticker, kpi=kpi)

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
        df=df, ticker=ticker, kpi=kpi, thresholds=thresholds, weights=weights
    )

    return pain_index
