import type {
    Stock,
    Company,
    CompanySearch,
    Kpi,
    HistoricalValue,
} from '../types/'

export const getStocks = async (): Promise<Stock[]> => {
    const response = await fetch('http://127.0.0.1:8000/api/companies')
    return await response.json()
}

export const getCompany = async (ticker: string): Promise<Company[]> => {
    const response = await fetch(
        'http://127.0.0.1:8000/api/company?' +
            new URLSearchParams({ ticker: ticker }).toString()
    )
    return await response.json()
}

export const getHistoricalValues = async (
    ticker: string,
    kpi: Kpi
): Promise<HistoricalValue[]> => {
    const response = await fetch(
        'http://127.0.0.1:8000/api/historicalValues?' +
            new URLSearchParams({ ticker: ticker, kpi: kpi }).toString()
    )
    return await response.json()
}

export const searchCompanies = async (
    text: string
): Promise<CompanySearch[]> => {
    const response = await fetch(
        'http://127.0.0.1:8000/api/searchCompanies?' +
            new URLSearchParams({ text: text }).toString()
    )
    return await response.json()
}
