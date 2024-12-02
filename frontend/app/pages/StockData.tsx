import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import StockHeader from '../components/StockHeader'
import KpiCard from '../components/KpiCard'
import { getCompany } from '../api/stocks'
import { getKpiInfo } from '../data/kpi'
import DataContainer from '../components/DataContainer'
import ChartContainer from '../components/ChartContainer'

import type { Company } from '../types/stocks'

interface Props {
    ticker: string | undefined
}

export default function StockData({ ticker }: Props) {
    const [isChartContainerOpened, setIsChartContainerOpened] = useState(false)

    const openChartContainer = () => {
        setIsChartContainerOpened(true)
    }

    ticker = ticker?.toUpperCase()
    const query = useQuery({
        queryKey: ['company', { ticker }],
        queryFn: () => getCompany(ticker !== undefined ? ticker : ''),
    })

    if (query.isPending)
        return (
            <div className="font-normal text-appTextNormal">
                Loading Data...
            </div>
        )

    if (query.error)
        return (
            <div className="font-normal text-red-500">
                An error has occurred while loading data: {query.error.message}
            </div>
        )

    const tickerData = query.data[0]

    return (
        <div className="w-screen pb-4">
            <StockHeader
                ticker={ticker}
                name={tickerData.name}
                segment={tickerData.segment}
                price={tickerData.price}
                pl={tickerData.pl}
                dividendYield={tickerData.dividendYield}
                rating={tickerData.rating}
            />
            <div className="space-y-4">
                <DataContainer title="Indicadores" childrenHeight="31">
                    <div className="mb-0 space-y-6">
                        <ValueKpis
                            tickerData={tickerData}
                            openChartContainer={openChartContainer}
                        />
                        <DebtKpis
                            tickerData={tickerData}
                            openChartContainer={openChartContainer}
                        />
                        <EfficiencyKpis
                            tickerData={tickerData}
                            openChartContainer={openChartContainer}
                        />
                        <GrowthKpis
                            tickerData={tickerData}
                            openChartContainer={openChartContainer}
                        />
                    </div>
                </DataContainer>

                <DataContainer title="Resultados" childrenHeight="10">
                    <div className="mb-0 space-y-6">
                        <ResultsGroup
                            tickerData={tickerData}
                            openChartContainer={openChartContainer}
                        />
                    </div>
                </DataContainer>
            </div>
            <ChartContainer isOpened={isChartContainerOpened} />
        </div>
    )
}

interface KpiGroupProps {
    groupName?: string
    kpis: {
        title: string
        value: string
        titleExplained?: string
        description?: string
        calculation?: string
    }[]
    openChartContainer: () => void
}

function KpiGroup({ groupName, kpis, openChartContainer }: KpiGroupProps) {
    return (
        <div>
            {groupName !== undefined ? (
                <div className="text-appTextNormal font-semibold mb-2 text-base">
                    {groupName}
                </div>
            ) : null}
            <div className="grid grid-cols-4 mb-2 gap-4">
                {kpis.map((d, i) => (
                    <KpiCard
                        key={i}
                        title={d.title}
                        value={d.value}
                        titleExplained={d.titleExplained}
                        description={d.description}
                        calculation={d.calculation}
                        openChartContainer={openChartContainer}
                    />
                ))}
            </div>
        </div>
    )
}

interface IndividualGroupProps {
    tickerData: Company
    openChartContainer: () => void
}

function ValueKpis({ tickerData, openChartContainer }: IndividualGroupProps) {
    return (
        <KpiGroup
            groupName="Valor"
            kpis={[
                getKpiInfo(tickerData, 'pl'),
                getKpiInfo(tickerData, 'pvp'),
                getKpiInfo(tickerData, 'dividendYield'),
                getKpiInfo(tickerData, 'dividendPayout'),
                getKpiInfo(tickerData, 'marketCap'),
                getKpiInfo(tickerData, 'bazinPrice'),
            ]}
            openChartContainer={openChartContainer}
        />
    )
}

function DebtKpis({ tickerData, openChartContainer }: IndividualGroupProps) {
    return (
        <KpiGroup
            groupName="Endividamento"
            kpis={[
                getKpiInfo(tickerData, 'netDebtByEbit'),
                getKpiInfo(tickerData, 'netDebtByEquity'),
            ]}
            openChartContainer={openChartContainer}
        />
    )
}

function EfficiencyKpis({
    tickerData,
    openChartContainer,
}: IndividualGroupProps) {
    return (
        <KpiGroup
            groupName="Eficiência"
            kpis={[
                getKpiInfo(tickerData, 'netMargin'),
                getKpiInfo(tickerData, 'roe'),
            ]}
            openChartContainer={openChartContainer}
        />
    )
}

function GrowthKpis({ tickerData, openChartContainer }: IndividualGroupProps) {
    return (
        <KpiGroup
            groupName="Crescimento"
            kpis={[
                getKpiInfo(tickerData, 'cagr5YearsProfit'),
                getKpiInfo(tickerData, 'cagr5YearsRevenue'),
            ]}
            openChartContainer={openChartContainer}
        />
    )
}

function ResultsGroup({
    tickerData,
    openChartContainer,
}: IndividualGroupProps) {
    return (
        <KpiGroup
            kpis={[
                getKpiInfo(tickerData, 'equity'),
                getKpiInfo(tickerData, 'netRevenue'),
                getKpiInfo(tickerData, 'profit'),
                getKpiInfo(tickerData, 'ebit'),
                getKpiInfo(tickerData, 'debt'),
                getKpiInfo(tickerData, 'netDebt'),
            ]}
            openChartContainer={openChartContainer}
        />
    )
}
