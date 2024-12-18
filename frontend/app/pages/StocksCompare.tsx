import { useQuery } from '@tanstack/react-query'
import { getStocksAndSegments } from '../api/stocks'
import PageHeaderContainer from '../components/PageHeaderContainer'
import { Select } from '../components/ui'

export default function StocksCompare() {
    const query = useQuery({
        queryKey: ['stocksAndCompanies'],
        queryFn: getStocksAndSegments,
    })

    if (query.isPending)
        return (
            <div className="font-normal text-appTextWeak">Loading Data...</div>
        )

    if (query.error)
        return (
            <div className="font-normal text-red-500">
                An error has occurred while loading data: {query.error.message}
            </div>
        )

    const selectItems =
        query.data !== undefined ? query.data.map((d) => d.ticker) : []

    return (
        <div className="w-screen pb-4">
            <PageHeaderContainer>
                <h1 className="text-4xl font-bold text-appTextStrongDark">
                    Comparador de Ações
                </h1>
            </PageHeaderContainer>
            <div className="container space-y-4">
                <div className="grid grid-cols-3">
                    <Select items={selectItems} />
                    <div className="flex flex-col h-fit w-fit p-6 rounded-2xl bg-white shadow shadow-grey-950/5">
                        <button>Select all from segment button</button>
                    </div>
                    <div className="flex flex-col h-fit w-fit p-6 rounded-2xl bg-white shadow shadow-grey-950/5">
                        <div className="flex h-full w-full items-center justify-center">
                            Show/Hide Radar Chart
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-3 space-x-4">
                    <div className="flex flex-col h-80 w-full p-6 rounded-2xl bg-white shadow shadow-grey-950/5">
                        <div className="flex h-full w-full items-center justify-center">
                            Comparative Radar Chart
                        </div>
                    </div>
                    <div className="col-span-2 flex flex-col h-80 w-full p-6 rounded-2xl bg-white shadow shadow-grey-950/5">
                        <div className="flex h-full w-full items-center justify-center">
                            Table with kpis
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
