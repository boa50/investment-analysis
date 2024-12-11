import pandas as pd
import numpy as np
import utils
import datasource


def get_latest_values_by_tickers(tickers=None):
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
    df["rating"] = np.random.random(size=df.shape[0]) * 5

    return df


def get_historical_values(ticker, kpi, n_years=10):
    try:
        kpi_original = utils.get_kpi_original_name(kpi)
    except Exception:
        kpi_original = kpi

    df_kpi = datasource.get_kpi(ticker=ticker, kpi=kpi_original, n_years=n_years)

    df_kpi = df_kpi.rename(
        columns={
            "DATE": "date",
            "CD_CVM": "cdCvm",
            "TICKER": "ticker",
            "VALUE": "value",
        }
    )

    return df_kpi


# def get_kpi_info(
#     ticker,
#     kpi,
#     is_segmento=False,
#     thresholds=[],
#     is_time_weighted=False,
#     is_inflation_weighted=False,
# ):
#     print("Getting values for " + ticker)

#     df, value_column, date_x_ticks = _get_kpi_props(
#         ticker, kpi, is_segemento=is_segmento
#     )

#     weights = utils.get_date_weights(dates=df["DATE"]) if is_time_weighted else None

#     if is_inflation_weighted and (kpi in ["PROFIT", "NET_REVENUE", "EBIT", "EQUITY"]):
#         inflation_weights = utils.get_ipca_weights(dates=df["DATE"])
#         if weights is None:
#             weights = inflation_weights
#         else:
#             weights *= inflation_weights

#     risk_calculation_values = df[value_column].copy()
#     kpi_volatility = df[value_column].std()
#     drawdowns = None

#     if kpi in ["NET_DEBT_BY_EBIT", "NET_DEBT_BY_EQUITY"]:
#         threshold = thresholds[0] if len(thresholds) == 1 else -np.inf
#         drawdowns = _get_drawdowns(
#             risk_calculation_values, drawdown_kpi_multiplier=-1, threshold=threshold
#         )
#     elif (kpi in ["DIVIDEND_PAYOUT"]) and (len(thresholds) > 1):
#         drawdowns1 = _get_drawdowns(
#             risk_calculation_values, drawdown_kpi_multiplier=1, threshold=thresholds[0]
#         )
#         drawdowns2 = _get_drawdowns(
#             risk_calculation_values, drawdown_kpi_multiplier=-1, threshold=thresholds[1]
#         )

#         drawdowns = np.minimum(drawdowns1, drawdowns2)
#     elif kpi in ["PL", "PVP"]:
#         ticker_shape = risk_calculation_values.shape[0]

#         df_segment, value_column_seg, _ = _get_kpi_props(ticker, kpi, is_segemento=True)
#         trend_line = get_trend(
#             df["DATE"],
#             df_segment[value_column_seg][-ticker_shape:],
#             is_time_weighted=False,
#         )

#         drawdowns = _get_drawdowns(
#             risk_calculation_values + trend_line.reshape(-1),
#             drawdown_kpi_multiplier=-1,
#             threshold=-np.inf,
#         )

#     if drawdowns is None:
#         drawdowns = _get_drawdowns(risk_calculation_values)

#     risk_measures = _get_risk_measures(drawdowns, weights=weights)

#     return {
#         "dates": df["DATE"],
#         "values": df[value_column] * (weights if weights is not None else 1),
#         "x_ticks": df["DATE"][::date_x_ticks],
#         "volatility": kpi_volatility,
#         "max_drawdown": risk_measures["max_dd"],
#         "pain_index": risk_measures["pain_index"],
#     }


# def get_trend(x, y, is_time_weighted=True):
#     # Giving more weight to data with dates closer to today
#     if is_time_weighted:
#         sample_weight = utils.get_date_weights(dates=x)
#     else:
#         sample_weight = None

#     x_train = x.values.astype(float).reshape(-1, 1)
#     y_train = y.values.reshape(-1, 1)

#     model = linear_model.LinearRegression()
#     model.fit(x_train, y_train, sample_weight=sample_weight)

#     trend = model.predict(x_train)

#     print("m: " + str(model.coef_[0][0]))
#     # print("Trend Last Value: " + str(trend[-1]))

#     return trend
