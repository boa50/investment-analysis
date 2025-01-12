import { useState, useCallback } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getHistoricalValues } from '../api/stocks'
import { getKpiInfo } from '../data/kpi'
import { LineChart } from '../charts/LineChart'
import { useDimensions } from '../charts/utils'
import { Icon } from './ui'

import { Kpi } from '../types'

interface Props {
    isOpened: boolean
    kpi: Kpi
    ticker: string
    closeChartContainer: () => void
}

export default function ChartContainer({
    isOpened,
    kpi,
    ticker,
    closeChartContainer,
}: Props) {
    const { title } = getKpiInfo(kpi)

    const commonClasses = 'fixed w-screen h-screen inset-0 z-40'

    return (
        <div className={isOpened ? 'block' : 'hidden'}>
            <div className={`${commonClasses} bg-gray-900 opacity-45`}></div>
            <div className={commonClasses}>
                <div className="flex h-full w-full items-center justify-center">
                    {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */}
                    <div
                        onClick={closeChartContainer}
                        className="absolute h-full w-full z-40"
                    ></div>
                    <div className="relative h-[75%] w-[55%] p-4 rounded-2xl bg-white shadow shadow-grey-950/5 z-50">
                        <div className="flex flex-col h-full">
                            <div className="flex items-center justify-between gap-4">
                                <div>{title}</div>
                                <div className="flex space-x-2">
                                    <button onClick={closeChartContainer}>
                                        <Icon type="cross" size={6} />
                                    </button>
                                </div>
                            </div>
                            <div className="flex items-center gap-8 pt-4 mt-4 border-t border-appRowDividerStrong"></div>
                            {isOpened ? (
                                <Chart ticker={ticker} kpi={kpi} />
                            ) : null}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

const fullDateKpis: Kpi[] = [
    Kpi.Price,
    Kpi.PriceProfit,
    Kpi.PriceEquity,
    Kpi.DividendYield,
    Kpi.DividendPayout,
]

interface ChartProps {
    ticker: string
    kpi: Kpi
}

function Chart({ ticker, kpi }: ChartProps) {
    const [chartDiv, setChartDiv] = useState<HTMLDivElement | null>(null)
    const onRefChange = useCallback((node: HTMLDivElement) => {
        if (node !== null) setChartDiv(node)
    }, [])
    const chartDimensions = useDimensions(chartDiv)

    const query = useQuery({
        queryKey: ['historicalValues', { ticker, kpi }],
        queryFn: () => getHistoricalValues(ticker, kpi),
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

    const historicalData = query.data.map((d) => {
        return { x: new Date(d.date), y: d.value }
    })

    return (
        <div ref={onRefChange} className="w-full h-full">
            <LineChart
                {...chartDimensions}
                data={historicalData}
                yFormatter={getKpiInfo(kpi).valueFormat}
                lineColour="rgb(var(--color-primary))"
                axesColour="rgb(var(--color-weak-light))"
                zeroLineColour="rgb(var(--color-divider-strong-light))"
                isQuarterTooltipFormat={!fullDateKpis.includes(kpi)}
            />
        </div>
    )
}
