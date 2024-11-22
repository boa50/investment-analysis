export type StockSearch = {
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
