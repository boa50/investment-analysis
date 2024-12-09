import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getCompany } from '../api/stocks'
import StockHeader from '../components/StockHeader'
import KpiCard from '../components/KpiCard'
import DataContainer from '../components/DataContainer'
import ChartContainer from '../components/ChartContainer'

import type { Kpi, Company } from '../types'

interface Props {
    ticker: string
}

export default function StockData({ ticker }: Props) {
    const [isChartContainerOpened, setIsChartContainerOpened] = useState(false)
    const [chartKpi, setChartKpi] = useState<Kpi>('price')

    const openChartContainer = (kpi: Kpi) => {
        setIsChartContainerOpened(true)
        setChartKpi(kpi)
    }

    const closeChartContainer = () => {
        setIsChartContainerOpened(false)
    }

    ticker = ticker.toUpperCase()
    const query = useQuery({
        queryKey: ['company', { ticker }],
        queryFn: () => getCompany(ticker),
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
            <StockHeader ticker={ticker} tickerData={tickerData} />
            <div className="space-y-4">
                <DataContainer title="Indicadores" childrenHeight="31">
                    <div className="mb-0 space-y-6">
                        <KpiGroup
                            groupName="Valor"
                            kpis={[
                                'pl',
                                'pvp',
                                'dividendYield',
                                'dividendPayout',
                                'marketCap',
                                'bazinPrice',
                            ]}
                            tickerData={tickerData}
                            openChartContainer={openChartContainer}
                        />
                        <KpiGroup
                            groupName="Endividamento"
                            kpis={['netDebtByEbit', 'netDebtByEquity']}
                            tickerData={tickerData}
                            openChartContainer={openChartContainer}
                        />
                        <KpiGroup
                            groupName="Eficiência"
                            kpis={['netMargin', 'roe']}
                            tickerData={tickerData}
                            openChartContainer={openChartContainer}
                        />
                        <KpiGroup
                            groupName="Crescimento"
                            kpis={['cagr5YearsProfit', 'cagr5YearsRevenue']}
                            tickerData={tickerData}
                            openChartContainer={openChartContainer}
                        />
                    </div>
                </DataContainer>

                <DataContainer title="Resultados" childrenHeight="10">
                    <div className="mb-0 space-y-6">
                        <KpiGroup
                            kpis={[
                                'equity',
                                'netRevenue',
                                'profit',
                                'ebit',
                                'debt',
                                'netDebt',
                            ]}
                            tickerData={tickerData}
                            openChartContainer={openChartContainer}
                        />
                    </div>
                </DataContainer>
            </div>
            <ChartContainer
                isOpened={isChartContainerOpened}
                kpi={chartKpi}
                ticker={ticker}
                closeChartContainer={closeChartContainer}
            />
        </div>
    )
}

interface KpiGroupProps {
    groupName?: string
    kpis: Kpi[]
    tickerData: Company
    openChartContainer: (kpi: Kpi) => void
}

function KpiGroup({
    groupName,
    kpis,
    tickerData,
    openChartContainer,
}: KpiGroupProps) {
    const hideChartKpis = ['bazinPrice', 'marketCap']

    return (
        <div>
            {groupName !== undefined ? (
                <div className="text-appTextNormal font-semibold mb-2 text-base">
                    {groupName}
                </div>
            ) : null}
            <div className="grid grid-cols-4 mb-2 gap-4">
                {kpis.map((kpi, i) => (
                    <KpiCard
                        key={i}
                        kpi={kpi}
                        tickerData={tickerData}
                        openChartContainer={() => openChartContainer(kpi)}
                        showChartIcon={
                            hideChartKpis.includes(kpi) ? false : true
                        }
                    />
                ))}
            </div>
        </div>
    )
}
