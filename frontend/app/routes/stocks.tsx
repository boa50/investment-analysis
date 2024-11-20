import {
    dehydrate,
    HydrationBoundary,
    QueryClient
} from '@tanstack/react-query'
import { json } from '@remix-run/node'
import { useLoaderData } from "@remix-run/react"
import { getStocks } from '../api/stocks'
import StockTable from '../components/StocksTable'

import type { MetaFunction } from "@remix-run/node"

export const meta: MetaFunction = () => {
    return [
        { title: "Investment Analysis - Stocks List" },
        { name: "description", content: "List of the stocks" },
    ];
};

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
        <div className="flex flex-wrap">
            <div className="flex flex-col gap-8">
                <header className="flex flex-col items-center gap-9">
                    <h1 className="leading text-2xl font-bold text-gray-800">
                        Lista das ações
                    </h1>
                </header>
                <div className="px-8 py-2 flex w-screen items-center justify-center">
                    <HydrationBoundary state={dehydratedState}>
                        <StockTable />
                    </HydrationBoundary>
                </div>
            </div>
        </div>
    )
}