import { useState, useEffect } from 'react';
import {
    QueryClient,
    QueryClientProvider,
    useQuery,
} from '@tanstack/react-query'
import { useLoaderData } from "@remix-run/react";
import type { MetaFunction, LoaderFunctionArgs } from "@remix-run/node";

export const meta: MetaFunction = () => {
    return [
        { title: "Investment Analysis - Stock Info" },
        { name: "description", content: "Information of the stock" },
    ];
};

type Stock = {
    ticker: string;
    name: string;
    segment: string;
    marketCap: number;
    pl: number;
    netMargin: number;
}

const queryClient = new QueryClient()

export async function loader({
    params,
}: LoaderFunctionArgs) {
    const ticker = params.ticker

    return { ticker: ticker };
}

export default function StockInfo() {
    const data = useLoaderData<typeof loader>();

    return (
        <div className="flex flex-wrap">
            <div className="flex flex-col gap-8">
                <header className="flex flex-col items-center gap-9">
                    <h1 className="leading text-2xl font-bold text-gray-800">
                        {"Dados de " + data.ticker}
                    </h1>
                </header>
                <div className="px-8 py-2 flex w-screen items-center justify-center">
                    <QueryClientProvider client={queryClient}>
                        <StockKpis />
                    </QueryClientProvider>
                </div>
            </div>
        </div>
    )
}

function StockKpis() {
    const [data, setData] = useState<Stock[]>([])

    const query = useQuery({
        queryKey: ['companiesData'],
        queryFn: async () => {
            const response = await fetch(
                'http://127.0.0.1:8000/api/companies',
            )
            return await response.json()
        },
    })

    useEffect(() => {
        if (query.data !== undefined) {
            setData(query.data)
        }

    }, [query])


    return (
        <div>
            <p>{data[0] !== undefined ? data[0].ticker : null}</p>
        </div>
    )
}