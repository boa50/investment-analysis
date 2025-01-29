import {
    dehydrate,
    HydrationBoundary,
    QueryClient,
} from '@tanstack/react-query'
import { json } from '@remix-run/node'
import {
    useLoaderData,
    isRouteErrorResponse,
    useRouteError,
} from '@remix-run/react'
import { hasStockData } from '../api/stocks'
import StockData from '../pages/StockData'
import CenteredInfo from '../components/CenteredInfo'
import type { MetaFunction, LoaderFunctionArgs } from '@remix-run/node'

export const meta: MetaFunction = () => {
    return [
        { title: 'Investment Analysis - Stock Info' },
        { name: 'description', content: 'Information of the stock' },
    ]
}

export async function loader({ params }: LoaderFunctionArgs) {
    let ticker = params.ticker?.toUpperCase()
    ticker = ticker?.includes('TRPL') ? 'ISAE' + ticker.substring(4) : ticker
    const queryClient = new QueryClient()

    try {
        const data = await queryClient.fetchQuery({
            queryKey: ['hasStockData', { ticker }],
            queryFn: () => hasStockData(ticker ?? '', process.env.DATABASE_URL),
        })

        if (data.result === false)
            throw new Error(
                `Não foram encontrados dados para o ticker ${ticker}. Tente outro valor`
            )
    } catch (error) {
        const statusText =
            error instanceof Error
                ? error.message
                : 'Houve uma falha na página, por favor tente novamente'

        throw new Response(null, { status: 404, statusText })
    }

    return json({ dehydratedState: dehydrate(queryClient), ticker: ticker })
}

export default function StockInfo() {
    const { dehydratedState, ticker } = useLoaderData<typeof loader>()

    return (
        <HydrationBoundary state={dehydratedState}>
            {ticker !== undefined ? <StockData ticker={ticker} /> : null}
        </HydrationBoundary>
    )
}

export function ErrorBoundary() {
    const error = useRouteError()

    return (
        <CenteredInfo>
            <span className="text-4xl font-semibold">
                {isRouteErrorResponse(error)
                    ? `${error.statusText}`
                    : error instanceof Error
                      ? error.message
                      : 'Erro Inesperado'}
            </span>
        </CenteredInfo>
    )
}
