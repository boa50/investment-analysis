import { useEffect, useState, useMemo, useCallback } from 'react'
import { useQuery, useQueries } from '@tanstack/react-query'
import { getStocksAndSegments, getStockRatings } from '../api/stocks'
import PageHeaderContainer from '../components/PageHeaderContainer'
import { Select, ToggleButton } from '../components/ui'
import RadarChart from '../charts/RadarChart'
import { useDimensions } from '../charts/utils'

export default function StocksCompare() {
    const [activeStocks, setActiveStocks] = useState<Set<string>>(new Set([]))
    const [includedSegment, setIncludedSegment] = useState<Set<string>>(
        new Set([])
    )
    const [isChartShown, setIsChartShown] = useState<boolean>(true)
    const [chartDiv, setChartDiv] = useState<HTMLDivElement | null>(null)
    const onRefChange = useCallback((node: HTMLDivElement) => {
        if (node !== null) setChartDiv(node)
    }, [])
    const chartDimensions = useDimensions(chartDiv)

    const query = useQuery({
        queryKey: ['stocksAndCompanies'],
        queryFn: getStocksAndSegments,
    })

    const queriesRatings = useQueries({
        queries: [...activeStocks].map((ticker) => {
            return {
                queryKey: ['stockRating', { ticker }],
                queryFn: () => getStockRatings(ticker),
            }
        }),
    })

    let stockRatings: {
        [variable: string]: number
    }[] = []

    if (queriesRatings.length > 0) {
        stockRatings = queriesRatings
            .filter((d) => d.isSuccess)
            .map((d) => {
                const ratingsTmp: {
                    [variable: string]: number
                } = { ...d.data }
                delete ratingsTmp['overall']
                return ratingsTmp
            })
    }

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

    const radarChart =
        stockRatings.length > 0 ? (
            <RadarChart
                data={stockRatings}
                {...chartDimensions}
                widthPadding={175}
                gridColour="rgb(var(--color-weak-light))"
                valueColours={[
                    'rgb(var(--color-primary))',
                    'rgb(var(--color-divider-strong-light))',
                    'red',
                ]}
                gridNumLevels={6}
                gridType="circle"
                gridAxesLabels={{
                    value: 'Valor',
                    debt: 'Endividamento',
                    growth: 'Crescimento',
                    efficiency: 'Eficiência',
                }}
                showTooltips={true}
            />
        ) : null

    return (
        <div className="w-screen pb-4">
            <PageHeaderContainer>
                <h1 className="text-4xl font-bold text-appTextStrongDark">
                    Comparador de Ações
                </h1>
            </PageHeaderContainer>
            <div className="container space-y-1">
                <div className="grid grid-cols-3">
                    <Select
                        items={selectStocks}
                        placeholderText="Inclua um ativo"
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
                    <div className="flex justify-end align-bottom items-end">
                        <ToggleButton
                            isChecked={isChartShown}
                            setIsChecked={setIsChartShown}
                            label="Mostrar Gráfico"
                        />
                    </div>
                </div>
                <div className="grid grid-cols-3 gap-x-4">
                    <div
                        className={`flex flex-col h-80 w-full p-6 rounded-2xl bg-white shadow shadow-grey-950/5 ${isChartShown ? 'col-span-2' : 'col-span-3'}`}
                    >
                        <div className="flex h-full w-full items-center justify-center">
                            Table with kpis
                        </div>
                    </div>
                    {isChartShown ? (
                        <div className="flex flex-col h-80 w-full rounded-2xl bg-white shadow shadow-grey-950/5">
                            <div
                                ref={onRefChange}
                                className="flex h-full w-full items-center justify-center"
                            >
                                {radarChart}
                            </div>
                        </div>
                    ) : null}
                </div>
            </div>
        </div>
    )
}
