import { getKpiInfo } from '../data/kpi'

import type { Company, Kpi } from '../types'

interface Props {
    isOpened: boolean
    kpi: Kpi
    tickerData: Company
}

export default function ChartContainer({ isOpened, kpi, tickerData }: Props) {
    const { title } = getKpiInfo(tickerData, kpi)

    const commonClasses = 'fixed w-screen h-screen inset-0 z-50'

    return (
        <div className={isOpened ? 'block' : 'hidden'}>
            <div className={`${commonClasses} bg-gray-900 opacity-45`}></div>
            <div className={commonClasses}>
                <div className="flex h-full w-full items-center justify-center">
                    <div className="relative h-[65%] w-[65%] p-4 rounded-2xl bg-white shadow shadow-grey-950/5">
                        <div className="flex items-center justify-between gap-4 mb-2">
                            <div>{title}</div>
                            <div>Chart Options</div>
                        </div>
                        <div className="flex items-center gap-8 pt-4 mt-6 border-t border-blue-gray-50"></div>
                        <div>
                            <div>Chart content</div>
                            <div>Chart content</div>
                            <div>Chart content</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
