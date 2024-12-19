import { useEffect, useState, useMemo, useCallback } from 'react'
import { useQuery, useQueries } from '@tanstack/react-query'
import {
    getStocksAndSegments,
    getStockRatings,
    getCompany,
} from '../api/stocks'
import PageHeaderContainer from '../components/PageHeaderContainer'
import { Select, ToggleButton } from '../components/ui'
import RadarChart from '../charts/RadarChart'
import { useDimensions } from '../charts/utils'
import Table from '../components/Table'

import type { Company } from '../types'

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

    const queriesCompanies = useQueries({
        queries: [...activeStocks].map((ticker) => {
            return {
                queryKey: ['company', { ticker }],
                queryFn: () => getCompany(ticker),
            }
        }),
    })

    const companiesData: Company[] = useMemo(() => {
        return queriesCompanies.filter((d) => d.isSuccess).map((d) => d.data[0])
    }, [queriesCompanies])

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

    const radarChart = stockRatings.length > 0 && (
        <RadarChart
            data={stockRatings}
            {...chartDimensions}
            widthPadding={175}
            gridColour="rgb(var(--color-weak-light))"
            valueColours={
                stockRatings.length <= 2
                    ? [
                          'rgb(var(--color-primary))',
                          'rgb(var(--color-secondary))',
                      ]
                    : ['rgb(var(--color-divider-strong-light))']
            }
            gridNumLevels={6}
            gridType="circle"
            gridAxesLabels={{
                value: 'Valor',
                debt: 'Endividamento',
                growth: 'Crescimento',
                efficiency: 'Eficiência',
            }}
            showTooltips={false}
        />
    )

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
                        className={`relative h-80 w-full overflow-auto rounded-2xl bg-white shadow shadow-grey-950/5 ${isChartShown ? 'col-span-2' : 'col-span-3'}`}
                    >
                        <Table
                            data={companiesData}
                            columns={['ticker', 'marketCap', 'pl', 'netMargin']}
                        />
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
