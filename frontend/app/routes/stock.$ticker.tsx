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
import { getCompany } from '../api/stocks'
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
    const ticker = params.ticker?.toUpperCase()
    const queryClient = new QueryClient()

    try {
        const data = await queryClient.fetchQuery({
            queryKey: ['company', { ticker }],
            queryFn: () => getCompany(ticker ?? ''),
        })

        if (!data[0])
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
