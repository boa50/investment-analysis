import numpy as np
from sklearn import linear_model
import datasource


def calculate_kpi_pain_index(df, ticker, kpi, thresholds=[], weights=None):
    values = df["VALUE"]
    drawdowns = None

    if kpi in ["NET_DEBT_BY_EBIT", "NET_DEBT_BY_EQUITY"]:
        threshold = thresholds[0] if len(thresholds) == 1 else -np.inf
        drawdowns = calculate_drawdowns(
            values, drawdown_kpi_multiplier=-1, threshold=threshold
        )
    elif (kpi in ["DIVIDEND_PAYOUT"]) and (len(thresholds) > 1):
        drawdowns1 = calculate_drawdowns(
            values, drawdown_kpi_multiplier=1, threshold=thresholds[0]
        )
        drawdowns2 = calculate_drawdowns(
            values, drawdown_kpi_multiplier=-1, threshold=thresholds[1]
        )

        drawdowns = np.minimum(drawdowns1, drawdowns2)
    elif kpi in ["PL", "PVP"]:
        ticker_shape = values.shape[0]

        df_segment = datasource.get_kpi_values(
            ticker=ticker, kpi=kpi, is_from_segment=True
        )
        trend_line, _ = calculate_trend(df["DATE"], df_segment["VALUE"][-ticker_shape:])

        drawdowns = calculate_drawdowns(
            values + trend_line.reshape(-1),
            drawdown_kpi_multiplier=-1,
            threshold=-np.inf,
        )

    if drawdowns is None:
        drawdowns = calculate_drawdowns(values)

    pain_index = calculate_pain_index(drawdowns, weights=weights)

    return pain_index


def calculate_trend(x, y, sample_weight=None):
    x_train = x.values.astype(float).reshape(-1, 1)
    y_train = y.values.reshape(-1, 1)

    model = linear_model.LinearRegression()
    model.fit(x_train, y_train, sample_weight=sample_weight)

    trend = model.predict(x_train)
    m = model.coef_[0][0]

    return trend, m


def calculate_drawdowns(
    risk_calculation_values, drawdown_kpi_multiplier=1, threshold=np.inf
):
    risk_values = np.minimum(
        risk_calculation_values * drawdown_kpi_multiplier,
        threshold * drawdown_kpi_multiplier,
    )
    running_max = np.maximum.accumulate(risk_values)
    drawdowns = ((risk_values - running_max) / running_max) * drawdown_kpi_multiplier

    return drawdowns.fillna(0)


def calculate_pain_index(drawdowns, weights=None):
    pain_index = np.average(drawdowns, weights=weights)

    return pain_index
