import { useEffect, useState } from 'react'
import { getKpiInfo } from '../data/kpi'
import Icon from './Icon'
import { LineChart } from '../charts/LineChart'
import { useMediaQueries } from './utils'

import type { Company, Kpi } from '../types'

interface Props {
    isOpened: boolean
    kpi: Kpi
    tickerData: Company
    closeChartContainer: () => void
}

export default function ChartContainer({
    isOpened,
    kpi,
    tickerData,
    closeChartContainer,
}: Props) {
    const screenSize = useMediaQueries()
    const [chartDimensions, setChartDimensions] = useState({
        width: 0,
        height: 0,
    })
    const { title } = getKpiInfo(tickerData, kpi)

    useEffect(() => {
        let width = 0
        let scale = 0
        if (screenSize.xl2) {
            width = 1056
            scale = 9 / 16
        } else if (screenSize.xl) {
            width = 880
            scale = 12 / 16
        } else if (screenSize.lg) {
            width = 880
            scale = 12 / 16
        } else if (screenSize.md) {
            width = 880
            scale = 12 / 16
        } else {
            width = 880
            scale = 12 / 16
        }

        setChartDimensions({
            width: width,
            height: width * scale,
        })
    }, [screenSize.xl2, screenSize.xl, screenSize.lg, screenSize.md])

    const commonClasses = 'fixed w-screen h-screen inset-0 z-50'

    return (
        <div className={isOpened ? 'block' : 'hidden'}>
            <div className={`${commonClasses} bg-gray-900 opacity-45`}></div>
            <div className={commonClasses}>
                {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */}
                <div
                    onClick={closeChartContainer}
                    className="flex h-full w-full items-center justify-center"
                >
                    <div className="relative h-[75%] w-[55%] p-4 rounded-2xl bg-white shadow shadow-grey-950/5">
                        <div className="flex flex-col h-full">
                            <div className="flex items-center justify-between gap-4 mb-2">
                                <div>{title}</div>
                                <div className="flex space-x-2">
                                    <div>Chart Options</div>
                                    <button onClick={closeChartContainer}>
                                        <Icon type="cross" size={6} />
                                    </button>
                                </div>
                            </div>
                            <div className="flex items-center gap-8 pt-4 mt-6 border-t border-gray-200"></div>
                            <div className="flex items-center justify-center bg-red-200 w-full h-full">
                                <LineChart {...chartDimensions} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
