import type { Stock, Company } from '../types/stocks'

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
