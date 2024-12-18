import { useEffect, useState, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getStocksAndSegments } from '../api/stocks'
import PageHeaderContainer from '../components/PageHeaderContainer'
import { Select } from '../components/ui'

export default function StocksCompare() {
    const [activeStocks, setActiveStocks] = useState<Set<string>>(new Set([]))
    const [includedSegment, setIncludedSegment] = useState<Set<string>>(
        new Set([])
    )

    const query = useQuery({
        queryKey: ['stocksAndCompanies'],
        queryFn: getStocksAndSegments,
    })

    const stocksAndSegmentsData = useMemo(() => query.data ?? [], [query.data])
    const selectStocks = stocksAndSegmentsData.map((d) => d.ticker)
    const selectSegments = [
        ...new Set(stocksAndSegmentsData.map((d) => d.segment)),
    ]

    useEffect(() => {
        const stocks = stocksAndSegmentsData
            .filter((d) => d.segment === includedSegment.values().next().value)
            .map((d) => d.ticker)

        setActiveStocks((activeStocks) => new Set([...activeStocks, ...stocks]))
    }, [includedSegment, stocksAndSegmentsData])

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

    return (
        <div className="w-screen pb-4">
            <PageHeaderContainer>
                <h1 className="text-4xl font-bold text-appTextStrongDark">
                    Comparador de Ações
                </h1>
            </PageHeaderContainer>
            <div className="container space-y-4">
                <div className="grid grid-cols-3">
                    <Select
                        items={selectStocks}
                        placeholderText="Escolha um ativo"
                        activeItems={activeStocks}
                        setActiveItems={setActiveStocks}
                    />
                    <Select
                        items={selectSegments}
                        placeholderText="Inclua um segmento"
                        activeItems={includedSegment}
                        setActiveItems={setIncludedSegment}
                        isSingleChoice={true}
                    />
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
