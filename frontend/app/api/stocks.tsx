import type {
    Stock,
    Company,
    CompanySearch,
    Kpi,
    HistoricalValue,
    StockRating,
    StockAndSegement,
} from '../types/'

export const getStocks = async (
    databaseUrl?: string | unknown
): Promise<Stock[]> => {
    const response = await fetch(`${getApiUrl(databaseUrl)}/companies`)

    return await response.json()
}

export const getStocksAndSegments = async (
    databaseUrl?: string | unknown
): Promise<StockAndSegement[]> => {
    const response = await fetch(
        `${getApiUrl(databaseUrl)}/companiesAndSegments`
    )
    return await response.json()
}

export const getStockRatings = async (
    ticker: string,
    databaseUrl?: string | unknown
): Promise<StockRating> => {
    const response = await fetch(
        `${getApiUrl(databaseUrl)}/stockRatings?${getSearchParams({ ticker: ticker })}`
    )
    return await response.json()
}

export const hasStockData = async (
    ticker: string,
    databaseUrl?: string | unknown
): Promise<{ result: boolean }> => {
    const response = await fetch(
        `${getApiUrl(databaseUrl)}/hasStockData?${getSearchParams({ ticker: ticker })}`
    )
    return await response.json()
}

export const getCompany = async (
    ticker: string,
    databaseUrl?: string | unknown
): Promise<Company[]> => {
    const response = await fetch(
        `${getApiUrl(databaseUrl)}/company?${getSearchParams({ ticker: ticker })}`
    )
    return await response.json()
}

export const searchCompanies = async (
    text: string,
    databaseUrl?: string | unknown
): Promise<CompanySearch[]> => {
    const response = await fetch(
        `${getApiUrl(databaseUrl)}/searchCompanies?${getSearchParams({ text: text })}`
    )
    return await response.json()
}

export const getHistoricalValues = async (
    ticker: string,
    kpi: Kpi,
    databaseUrl?: string | unknown
): Promise<HistoricalValue[]> => {
    const response = await fetch(
        `${getApiUrl(databaseUrl)}/historicalValues?${getSearchParams({ ticker: ticker, kpi: kpi })}`
    )
    return await response.json()
}

function getApiUrl(databaseUrl?: string | unknown): string {
    const dbUrl =
        databaseUrl !== undefined
            ? typeof databaseUrl === 'string'
                ? databaseUrl
                : window.ENV.DATABASE_URL
            : window.ENV.DATABASE_URL

    return `${dbUrl}/api`
}

function getSearchParams(params: Record<string, string>): string {
    return new URLSearchParams(params).toString()
}
