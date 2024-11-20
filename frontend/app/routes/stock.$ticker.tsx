import {
    dehydrate,
    HydrationBoundary,
    QueryClient,
    useQuery,
} from '@tanstack/react-query'
import { json } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { getStocks } from '../api/stocks'
import type { MetaFunction, LoaderFunctionArgs } from '@remix-run/node'
import type { Stock } from '../types/stocks'

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
        queryKey: ['stocks'],
        queryFn: getStocks,
    })

    return json({ dehydratedState: dehydrate(queryClient), ticker: ticker })
}

export default function StockInfo() {
    const { dehydratedState, ticker } = useLoaderData<typeof loader>()

    return (
        <div className="flex flex-wrap">
            <div className="flex flex-col gap-8">
                <header className="flex flex-col items-center gap-9">
                    <h1 className="leading text-2xl font-bold text-gray-800">
                        {'Dados de ' + ticker}
                    </h1>
                </header>
                <div className="px-8 py-2 flex w-screen items-center justify-center">
                    <HydrationBoundary state={dehydratedState}>
                        <StockKpis ticker={ticker} />
                    </HydrationBoundary>
                </div>
            </div>
        </div>
    )
}

function StockKpis({ ticker }: { ticker: string | undefined }) {
    const query = useQuery({ queryKey: ['stocks'], queryFn: getStocks })

    if (query.isPending)
        return <div className="font-normal text-gray-500">Loading Data...</div>

    if (query.error)
        return (
            <div className="font-normal text-red-500">
                An error has occurred while loading data: {query.error.message}
            </div>
        )

    const tickerData = query.data.filter((d: Stock) => d.ticker === ticker)[0]

    return (
        <div>
            <p>{'Ticker: ' + tickerData.ticker}</p>
            <p>{'Name: ' + tickerData.name}</p>
            <p>{'Segment: ' + tickerData.segment}</p>
            <p>{'Market Cap: ' + tickerData.marketCap}</p>
            <p>{'P/L: ' + tickerData.pl}</p>
            <p>{'Net Margin: ' + tickerData.netMargin}</p>
        </div>
    )
}
