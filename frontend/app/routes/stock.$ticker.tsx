import {
    dehydrate,
    HydrationBoundary,
    QueryClient,
    useQuery,
} from '@tanstack/react-query'
import { json } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { getCompany } from '../api/stocks'
import { formatNum } from '../components/utils'
import StockHeader from '../components/StockHeader'
import type { MetaFunction, LoaderFunctionArgs } from '@remix-run/node'

export const meta: MetaFunction = () => {
    return [
        { title: 'Investment Analysis - Stock Info' },
        { name: 'description', content: 'Information of the stock' },
    ]
}

export async function loader({ params }: LoaderFunctionArgs) {
    const ticker = params.ticker
    const queryClient = new QueryClient()

    await queryClient.prefetchQuery({
        queryKey: ['company'],
        queryFn: () => getCompany(ticker !== undefined ? ticker : ''),
    })

    return json({ dehydratedState: dehydrate(queryClient), ticker: ticker })
}

export default function StockInfo() {
    const { dehydratedState, ticker } = useLoaderData<typeof loader>()

    return (
        <div className="flex flex-wrap">
            <HydrationBoundary state={dehydratedState}>
                <StockData ticker={ticker} />
            </HydrationBoundary>
        </div>
    )
}

function StockData({ ticker }: { ticker: string | undefined }) {
    const query = useQuery({
        queryKey: ['company'],
        queryFn: () => getCompany(ticker !== undefined ? ticker : ''),
    })

    if (query.isPending)
        return <div className="font-normal text-gray-500">Loading Data...</div>

    if (query.error)
        return (
            <div className="font-normal text-red-500">
                An error has occurred while loading data: {query.error.message}
            </div>
        )

    const tickerData = query.data[0]

    return (
        <div>
            <StockHeader
                ticker={ticker}
                name={tickerData.name}
                segment={tickerData.segment}
                price={tickerData.price}
                pl={tickerData.pl}
                dividendYield={tickerData.dividendYield}
            />
            <div className="px-8 py-2 flex flex-col w-screen items-center justify-center">
                <p>
                    {'Market Cap: ' +
                        formatNum(tickerData.marketCap, 'currency')}
                </p>
                <p>
                    {'Price Bazin: ' +
                        formatNum(tickerData.bazinPrice, 'currencyDecimal')}
                </p>
                <p>{'P/L: ' + formatNum(tickerData.pl, 'decimal')}</p>
                <p>{'P/VP: ' + formatNum(tickerData.pvp, 'decimal')}</p>
                <p>
                    {'Dividend Yield: ' +
                        formatNum(tickerData.dividendYield, 'percent')}
                </p>
                <p>
                    {'Dividend Payout: ' +
                        formatNum(tickerData.dividendPayout, 'percent')}
                </p>
                <p>{'Equity: ' + formatNum(tickerData.equity, 'currency')}</p>
                <p>
                    {'Net Revenue: ' +
                        formatNum(tickerData.netRevenue, 'currency')}
                </p>
                <p>{'Profit: ' + formatNum(tickerData.profit, 'currency')}</p>
                <p>{'EBIT: ' + formatNum(tickerData.ebit, 'currency')}</p>
                <p>{'Debt: ' + formatNum(tickerData.debt, 'currency')}</p>
                <p>
                    {'Net Debt: ' + formatNum(tickerData.netDebt, 'currency')}
                </p>
                <p>
                    {'Net Margin: ' +
                        formatNum(tickerData.netMargin, 'percent')}
                </p>
                <p>{'RoE: ' + formatNum(tickerData.roe, 'percent')}</p>
                <p>
                    {'Net Debt by EBIT: ' +
                        formatNum(tickerData.netDebtByEbit, 'decimal')}
                </p>
                <p>
                    {'Net Debt by Equity: ' +
                        formatNum(tickerData.netDebtByEquity, 'decimal')}
                </p>
                <p>
                    {'CAGR 5 Years Profit: ' +
                        formatNum(tickerData.cagr5YearsProfit, 'percent')}
                </p>
                <p>
                    {'CAGR 5 Years Revenue: ' +
                        formatNum(tickerData.cagr5YearsRevenue, 'percent')}
                </p>
            </div>
        </div>
    )
}
