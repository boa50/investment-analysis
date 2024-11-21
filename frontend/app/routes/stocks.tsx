import {
    dehydrate,
    HydrationBoundary,
    QueryClient,
} from '@tanstack/react-query'
import { json } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { getStocks } from '../api/stocks'
import StockTable from '../pages/StocksTable'

import type { MetaFunction } from '@remix-run/node'

export const meta: MetaFunction = () => {
    return [
        { title: 'Investment Analysis - Stocks List' },
        { name: 'description', content: 'List of the stocks' },
    ]
}

export async function loader() {
    const queryClient = new QueryClient()

    await queryClient.prefetchQuery({
        queryKey: ['stocks'],
        queryFn: getStocks,
    })

    return json({ dehydratedState: dehydrate(queryClient) })
}

export default function StocksList() {
    const { dehydratedState } = useLoaderData<typeof loader>()

    return (
        <HydrationBoundary state={dehydratedState}>
            <StockTable />
        </HydrationBoundary>
    )
}
