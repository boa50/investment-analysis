export enum Kpi {
    MarketCap = 'marketCap',
    Price = 'price',
    BazinPrice = 'bazinPrice',
    Pl = 'pl',
    Pvp = 'pvp',
    DividendYield = 'dividendYield',
    DividendPayout = 'dividendPayout',
    Equity = 'equity',
    NetRevenue = 'netRevenue',
    Profit = 'profit',
    Ebit = 'ebit',
    Debt = 'debt',
    NetDebt = 'netDebt',
    NetMargin = 'netMargin',
    Roe = 'roe',
    NetDebtByEbit = 'netDebtByEbit',
    NetDebtByEquity = 'netDebtByEquity',
    Cagr5YearsProfit = 'cagr5YearsProfit',
    Cagr5YearsRevenue = 'cagr5YearsRevenue',
}

export enum KpiGroup {
    Value = 'value',
    Debt = 'debt',
    Efficiency = 'efficiency',
    Growth = 'growth',
    Results = 'results',
}

export type CompanySearch = {
    ticker: string
    name: string
    segment: string
}

export type Stock = {
    ticker: string
    name: string
    segment: string
    marketCap: number
    pl: number
    netMargin: number
}

export type StockAndSegement = {
    ticker: string
    segment: string
}

export type Company = {
    ticker: string
    name: string
    segment: string
    marketCap: number
    price: number
    bazinPrice?: number
    pl: number
    pvp: number
    dividendYield: number
    dividendPayout: number
    equity: number
    netRevenue: number
    profit: number
    ebit?: number
    debt?: number
    netDebt?: number
    netMargin: number
    roe: number
    netDebtByEbit?: number
    netDebtByEquity?: number
    cagr5YearsProfit: number
    cagr5YearsRevenue: number
}

export type HistoricalValue = {
    date: number
    cdCvm: number
    ticker: string
    value: number
}

export type StockRating = {
    value: number
    debt: number
    efficiency: number
    growth: number
    overall: number
}
