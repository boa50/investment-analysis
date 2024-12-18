kpi_renaming = {
    "TICKER": "ticker",
    "MAIN_TICKER": "ticker",
    "TICKERS": "tickers",
    "NOME": "name",
    "SEGMENTO": "segment",
    "MARKET_CAP": "marketCap",
    "PRICE": "price",
    "BAZIN": "bazinPrice",
    "PL": "pl",
    "PVP": "pvp",
    "DIVIDEND_YIELD": "dividendYield",
    "DIVIDEND_PAYOUT": "dividendPayout",
    "EQUITY": "equity",
    "NET_REVENUE": "netRevenue",
    "PROFIT": "profit",
    "EBIT": "ebit",
    "DEBT": "debt",
    "DEBT_NET": "netDebt",
    "NET_MARGIN": "netMargin",
    "ROE": "roe",
    "NET_DEBT_BY_EBIT": "netDebtByEbit",
    "NET_DEBT_BY_EQUITY": "netDebtByEquity",
    "CAGR_5_YEARS_PROFIT": "cagr5YearsProfit",
    "CAGR_5_YEARS_REVENUE": "cagr5YearsRevenue",
}

kpi_by_group = {
    "value": ["PL", "PVP", "DIVIDEND_YIELD", "DIVIDEND_PAYOUT"],
    "debt": ["NET_DEBT_BY_EBIT", "NET_DEBT_BY_EQUITY"],
    "efficiency": ["NET_MARGIN", "ROE"],
    "growth": ["CAGR_5_YEARS_PROFIT", "CAGR_5_YEARS_REVENUE"],
}
