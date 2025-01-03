import { useState, useMemo, useCallback } from 'react'
import { useQuery, useQueries } from '@tanstack/react-query'
import {
    getStocksAndSegments,
    getStockRatings,
    getCompany,
} from '../api/stocks'
import PageHeaderContainer from '../components/PageHeaderContainer'
import { Select, ToggleButton, Icon, BlurredElement } from '../components/ui'
import RadarChart from '../charts/RadarChart'
import { useDimensions } from '../charts/utils'
import Table from '../components/Table'
import { getGroupTitle } from '../data/group'

import { Kpi, KpiGroup } from '../types'
import { nonKpi } from '../components/Table/types'
import type { Company, Stock } from '../types'
import type { Cell } from '@tanstack/react-table'

export default function StocksCompare() {
    const [activeStocks, setActiveStocks] = useState<Set<string>>(new Set([]))
    const [chartStockHighlight, setChartStockHighlight] = useState<string>()
    const [isChartShown, setIsChartShown] = useState<boolean>(true)
    const [chartDiv, setChartDiv] = useState<HTMLDivElement | null>(null)
    const onRefChange = useCallback((node: HTMLDivElement) => {
        if (node !== null) setChartDiv(node)
    }, [])
    const chartDimensions = useDimensions(chartDiv)

    const handleStockRemoval = (ticker: string) => {
        setActiveStocks((activeStocks) => {
            const activeStocksTmp = new Set(activeStocks)
            activeStocksTmp.delete(ticker)
            return activeStocksTmp
        })
    }

    const handleAllStocksRemoval = () => {
        setActiveStocks(new Set([]))
    }

    const handleStockInclusion = (stocks: string[]) => {
        setActiveStocks((activeStocks) => new Set([...activeStocks, stocks[0]]))
    }

    const handleSegmentInclusion = (segment: string[]) => {
        const stocks = stocksAndSegmentsData
            .filter((d) => d.segment === segment[0])
            .map((d) => d.ticker)

        setActiveStocks((activeStocks) => new Set([...activeStocks, ...stocks]))
    }

    const handleRowHovered = (rowCells: Cell<Stock | Company, unknown>[]) => {
        setChartStockHighlight(rowCells[1].getValue() as string)
    }
    const handleRowUnhovered = () => {
        setChartStockHighlight(undefined)
    }

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
    const selectStocks = stocksAndSegmentsData
        .map((d) => d.ticker)
        .filter((ticker) => !activeStocks.has(ticker))
    const selectSegments = [
        ...new Set(stocksAndSegmentsData.map((d) => d.segment)),
    ]

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

    const getStockHighlight = () => {
        if (chartStockHighlight !== undefined) {
            const highlightIndex = [...activeStocks].indexOf(
                chartStockHighlight
            )

            if (highlightIndex < stockRatings.length) return highlightIndex
        }

        return undefined
    }

    const radarChart = stockRatings.length > 0 && (
        <RadarChart
            data={stockRatings}
            {...chartDimensions}
            widthPadding={175}
            gridColour="rgb(var(--color-weak-light))"
            valueColours={
                stockRatings.length === 1
                    ? ['rgb(var(--color-primary))']
                    : ['rgb(var(--color-divider-strong-light))']
            }
            gridNumLevels={6}
            gridType="circle"
            gridAxesLabels={{
                value: getGroupTitle(KpiGroup.Value),
                debt: getGroupTitle(KpiGroup.Debt),
                growth: getGroupTitle(KpiGroup.Growth),
                efficiency: getGroupTitle(KpiGroup.Efficiency),
            }}
            showTooltips={false}
            highlightedIndex={getStockHighlight()}
            highlightColour="rgb(var(--color-primary))"
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
                        handleItemsChange={handleStockInclusion}
                        isSingleChoice={true}
                        isHideAfterClick={false}
                    />
                    <Select
                        items={selectSegments}
                        placeholderText="Inclua um segmento"
                        handleItemsChange={handleSegmentInclusion}
                        isSingleChoice={true}
                    />
                </div>
                <div className="grid grid-cols-2">
                    <div>
                        <button
                            disabled={[...activeStocks].length === 0}
                            className="flex items-center disabled:opacity-50"
                            onClick={handleAllStocksRemoval}
                        >
                            <Icon type="cross" size={5} />
                            <div className="text-sm text-appTextNormal">
                                Remover todas as ações
                            </div>
                        </button>
                    </div>
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
                        className={`relative h-96 border-t border-gray-300 w-full overflow-auto rounded-2xl bg-white shadow shadow-grey-950/5 ${isChartShown ? 'col-span-2' : 'col-span-3'}`}
                    >
                        <BlurredElement
                            message="Escolha pelo menos 1 ação para analisar"
                            hideCondition={companiesData.length > 0}
                        >
                            <Table
                                data={companiesData}
                                columns={[
                                    nonKpi.Ticker,
                                    Kpi.Pl,
                                    Kpi.Pvp,
                                    Kpi.DividendYield,
                                    Kpi.DividendPayout,
                                    Kpi.MarketCap,
                                    Kpi.NetDebtByEbit,
                                    Kpi.NetDebtByEquity,
                                    Kpi.NetMargin,
                                    Kpi.Roe,
                                    Kpi.Cagr5YearsProfit,
                                    Kpi.Cagr5YearsRevenue,
                                    Kpi.Equity,
                                    Kpi.NetRevenue,
                                    Kpi.Profit,
                                    Kpi.Ebit,
                                    Kpi.Debt,
                                    Kpi.NetDebt,
                                ]}
                                isTickerSticky={true}
                                isHeaderGrouped={true}
                                handleRowRemoval={handleStockRemoval}
                                handleRowHovered={handleRowHovered}
                                handleRowUnhovered={handleRowUnhovered}
                            />
                        </BlurredElement>
                    </div>
                    {isChartShown ? (
                        <div className="flex flex-col h-96 w-full rounded-2xl bg-white shadow shadow-grey-950/5">
                            <BlurredElement
                                message="Escolha pelo menos 1 ação para analisar"
                                hideCondition={companiesData.length > 0}
                            >
                                <BlurredElement
                                    message="Obtendo dados..."
                                    hideCondition={
                                        queriesRatings.filter(
                                            (d) => d.isPending
                                        ).length === 0
                                    }
                                    blurStrength="strong"
                                >
                                    <div
                                        ref={onRefChange}
                                        className="flex h-full w-full items-center justify-center"
                                    >
                                        {radarChart}
                                    </div>
                                </BlurredElement>
                            </BlurredElement>
                        </div>
                    ) : null}
                </div>
            </div>
        </div>
    )
}
