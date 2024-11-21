import {
    dehydrate,
    HydrationBoundary,
    QueryClient,
} from '@tanstack/react-query'
import { json } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { getCompany } from '../api/stocks'
import StockData from '../pages/StockData'
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
        <HydrationBoundary state={dehydratedState}>
            <StockData ticker={ticker} />
        </HydrationBoundary>
    )
}
