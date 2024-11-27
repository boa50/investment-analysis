import { Company } from '../types/stocks'

const formatDecimal = (num: number): string =>
    Intl.NumberFormat('pt-BR', {
        maximumFractionDigits: 2,
    }).format(num)
const formatCurrency = (num: number, decimals: boolean = false): string =>
    new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        notation: 'compact',
        maximumFractionDigits: decimals ? 2 : 0,
    }).format(num)
const formatPercent = (num: number): string =>
    Intl.NumberFormat('pt-BR', {
        style: 'percent',
        maximumFractionDigits: 2,
    }).format(num)

export const formatNum = (
    num: number | undefined,
    formatType: 'decimal' | 'currency' | 'currencyDecimal' | 'percent'
): string => {
    if (num === undefined) return '-'

    switch (formatType) {
        case 'decimal':
            return formatDecimal(num)
        case 'currency':
            return formatCurrency(num)
        case 'currencyDecimal':
            return formatCurrency(num, true)
        case 'percent':
            return formatPercent(num)
        default:
            return num.toString()
    }
}

export const getMockCompany = (props: object): Company => {
    return {
        ticker: '',
        name: '',
        segment: '',
        marketCap: -1,
        price: -1,
        pl: -1,
        pvp: -1,
        dividendYield: -1,
        dividendPayout: -1,
        equity: -1,
        netRevenue: -1,
        profit: -1,
        netMargin: -1,
        roe: -1,
        cagr5YearsProfit: -1,
        cagr5YearsRevenue: -1,
        rating: -1,
        ...props,
    }
}
