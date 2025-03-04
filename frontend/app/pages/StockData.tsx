import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getCompany, getStockRatings } from '../api/stocks'
import StockHeader from '../components/StockHeader'
import KpiCard from '../components/KpiCard'
import DataContainer from '../components/DataContainer'
import ChartContainer from '../components/ChartContainer'
import RadarChart from '../charts/RadarChart'
import { getKpisByGroup, getGroupTitle } from '../data/group'
import CenteredInfo from '../components/CenteredInfo'
import { LoaderAnimation } from '../components/ui'

import { Kpi, KpiGroup as KpiGroupType } from '../types'
import type { Company } from '../types'

interface Props {
    ticker: string
}

export default function StockData({ ticker }: Props) {
    const [isChartContainerOpened, setIsChartContainerOpened] = useState(false)
    const [chartKpi, setChartKpi] = useState<Kpi>(Kpi.Price)

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

    const queryRatings = useQuery({
        queryKey: ['stockRating', { ticker }],
        queryFn: () => getStockRatings(ticker),
    })

    if (query.isPending)
        return (
            <CenteredInfo>
                <LoaderAnimation />
            </CenteredInfo>
        )

    if (query.error)
        return (
            <div className="font-normal text-red-500">
                An error has occurred while loading data: {query.error.message}
            </div>
        )

    const tickerData = query.data[0]

    let stockRatings:
        | {
              [variable: string]: number
          }
        | undefined

    if (queryRatings.data !== undefined) {
        stockRatings = { ...queryRatings.data }
        delete stockRatings['ticker']
        delete stockRatings['overall']
    }

    const ratingsChart =
        stockRatings !== undefined ? (
            <RadarChart
                data={[stockRatings]}
                width={250}
                widthPadding={150}
                gridColour="rgb(var(--color-weak-light))"
                valueColours={['rgb(var(--color-primary))']}
                gridNumLevels={6}
                gridType="circle"
                gridAxesLabels={{
                    value: getGroupTitle(KpiGroupType.Value),
                    debt: getGroupTitle(KpiGroupType.Debt),
                    growth: getGroupTitle(KpiGroupType.Growth),
                    efficiency: getGroupTitle(KpiGroupType.Efficiency),
                }}
                valueFormatter={(value) => (value / 20).toFixed(2)}
            />
        ) : null

    return (
        <div className="w-screen pb-4">
            <StockHeader
                ticker={ticker ?? ''}
                tickerData={tickerData}
                overallStockRating={queryRatings.data?.overall}
            />
            <div className="container space-y-4">
                <DataContainer title="Visão Geral" childrenHeight="20">
                    <div className="grid grid-cols-7 w-full gap-4">
                        <div className="col-span-3">{ratingsChart}</div>
                        <div className="flex flex-col gap-4 w-full col-span-4">
                            <div className="flex gap-8">
                                <KpiCard
                                    kpi={Kpi.Foundation}
                                    tickerData={tickerData}
                                    showChartIcon={false}
                                    showKpiDescription={false}
                                />
                                <KpiCard
                                    kpi={Kpi.FreeFloat}
                                    tickerData={tickerData}
                                    showChartIcon={false}
                                />
                            </div>
                            <div>More info about the company history</div>
                            <div className="grow"></div>
                            {tickerData.webPage ? (
                                <div className="flex w-full justify-end">
                                    <a
                                        className="text-sm text-appAccent"
                                        href={tickerData.webPage}
                                        target="_blank"
                                        rel="noreferrer"
                                    >
                                        Página de Relação com Investidores
                                    </a>
                                </div>
                            ) : null}
                        </div>
                    </div>
                </DataContainer>
                <DataContainer title="Indicadores" childrenHeight="31">
                    <div className="mb-0 space-y-6">
                        <KpiGroup
                            groupName="Valor"
                            kpis={getKpisByGroup(KpiGroupType.Value)}
                            tickerData={tickerData}
                            openChartContainer={openChartContainer}
                        />
                        <KpiGroup
                            groupName="Endividamento"
                            kpis={getKpisByGroup(KpiGroupType.Debt)}
                            tickerData={tickerData}
                            openChartContainer={openChartContainer}
                        />
                        <KpiGroup
                            groupName="Eficiência"
                            kpis={getKpisByGroup(KpiGroupType.Efficiency)}
                            tickerData={tickerData}
                            openChartContainer={openChartContainer}
                        />
                        <KpiGroup
                            groupName="Crescimento"
                            kpis={getKpisByGroup(KpiGroupType.Growth)}
                            tickerData={tickerData}
                            openChartContainer={openChartContainer}
                        />
                    </div>
                </DataContainer>

                <DataContainer title="Resultados" childrenHeight="10">
                    <div className="mb-0 space-y-6">
                        <KpiGroup
                            kpis={getKpisByGroup(KpiGroupType.Results)}
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
