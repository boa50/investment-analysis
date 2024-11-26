import { formatNum } from '../components/utils'
import type { Company } from '../types/stocks'

type Kpis =
    | 'marketCap'
    | 'price'
    | 'bazinPrice'
    | 'pl'
    | 'pvp'
    | 'dividendYield'
    | 'dividendPayout'
    | 'equity'
    | 'netRevenue'
    | 'profit'
    | 'ebit'
    | 'debt'
    | 'netDebt'
    | 'netMargin'
    | 'roe'
    | 'netDebtByEbit'
    | 'netDebtByEquity'
    | 'cagr5YearsProfit'
    | 'cagr5YearsRevenue'

export const getKpiInfo = (tickerData: Company, key: Kpis) => {
    switch (key) {
        case 'marketCap':
            return {
                title: 'Valor de Mercado',
                value: formatNum(tickerData.marketCap, 'currency'),
                description: 'Quanto a empresa vale',
            }
        case 'price':
            return {
                title: 'Preço',
                value: formatNum(tickerData.price, 'currencyDecimal'),
                description: '',
            }
        case 'bazinPrice':
            return {
                title: 'Preço Bazin',
                value: formatNum(tickerData.bazinPrice, 'currencyDecimal'),
                description: '',
            }
        case 'pl':
            return {
                title: 'P/L',
                value: formatNum(tickerData.pl, 'decimal'),
                description: '',
            }
        case 'pvp':
            return {
                title: 'P/VP',
                value: formatNum(tickerData.pvp, 'decimal'),
                description: '',
            }
        case 'dividendYield':
            return {
                title: 'Dividend Yield',
                value: formatNum(tickerData.dividendYield, 'percent'),
                description: '',
            }
        case 'dividendPayout':
            return {
                title: 'Dividend Payout',
                value: formatNum(tickerData.dividendPayout, 'percent'),
                description: '',
            }
        case 'equity':
            return {
                title: 'Patrimônio',
                value: formatNum(tickerData.equity, 'currency'),
                description: '',
            }
        case 'netRevenue':
            return {
                title: 'Receitas',
                value: formatNum(tickerData.netRevenue, 'currency'),
                description: '',
            }
        case 'profit':
            return {
                title: 'Lucro',
                value: formatNum(tickerData.profit, 'currency'),
                description: '',
            }
        case 'ebit':
            return {
                title: 'EBIT',
                value: formatNum(tickerData.ebit, 'currency'),
                description: '',
            }
        case 'debt':
            return {
                title: 'Dívida Bruta',
                value: formatNum(tickerData.debt, 'currency'),
                description: '',
            }
        case 'netDebt':
            return {
                title: 'Dívida Líquida',
                value: formatNum(tickerData.netDebt, 'currency'),
                description: '',
            }
        case 'netMargin':
            return {
                title: 'Margem Líquida',
                value: formatNum(tickerData.netMargin, 'percent'),
                description: '',
            }
        case 'roe':
            return {
                title: 'RoE',
                value: formatNum(tickerData.roe, 'percent'),
                description: '',
            }
        case 'netDebtByEbit':
            return {
                title: 'Dívida Líquida / EBIT',
                value: formatNum(tickerData.netDebtByEbit, 'decimal'),
                description: '',
            }
        case 'netDebtByEquity':
            return {
                title: 'Dívida Líquida / Patrimônio',
                value: formatNum(tickerData.netDebtByEquity, 'decimal'),
                description: '',
            }
        case 'cagr5YearsProfit':
            return {
                title: 'CAGR Lucros - 5 anos',
                value: formatNum(tickerData.cagr5YearsProfit, 'percent'),
                description: '',
            }
        case 'cagr5YearsRevenue':
            return {
                title: 'CAGR Receitas - 5 anos',
                value: formatNum(tickerData.cagr5YearsRevenue, 'percent'),
                description: '',
            }
        default:
            return {
                title: '-',
                value: '-',
                description: '',
            }
    }
}
