import {
    dehydrate,
    HydrationBoundary,
    QueryClient,
} from '@tanstack/react-query'
import { json } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { getStocksAndSegments } from '../api/stocks'
import StocksCompare from '../pages/StocksCompare'

import type { MetaFunction } from '@remix-run/node'

export const meta: MetaFunction = () => {
    return [
        { title: 'Investment Analysis - Stocks Compare' },
        { name: 'description', content: 'Comparison of Stocks' },
    ]
}

export async function loader() {
    const queryClient = new QueryClient()

    await queryClient.prefetchQuery({
        queryKey: ['stocksAndSegments'],
        queryFn: getStocksAndSegments,
    })

    return json({ dehydratedState: dehydrate(queryClient) })
}

export default function StocksList() {
    const { dehydratedState } = useLoaderData<typeof loader>()

    return (
        <HydrationBoundary state={dehydratedState}>
            <StocksCompare />
        </HydrationBoundary>
    )
}
