import KpiCard from './KpiCard'
import RatingStars from './RatingStars'
import PageHeaderContainer from './PageHeaderContainer'

import type { Company, Kpi } from '../types'

interface Props {
    ticker: string | undefined
    tickerData: Company
    overallStockRating?: number
}

export default function StockHeader({
    ticker,
    tickerData,
    overallStockRating,
}: Props) {
    const Kpis = () => {
        return (
            <div className="grid grid-cols-3 gap-4 flex items-center">
                <StockHeaderKpi kpi="price" tickerData={tickerData} />
                <StockHeaderKpi kpi="pl" tickerData={tickerData} />
                <StockHeaderKpi kpi="dividendYield" tickerData={tickerData} />
            </div>
        )
    }

    return (
        <PageHeaderContainer extraClasses="grid grid-cols-2 gap-24">
            <div className="flex flex-row space-x-8">
                <div className="flex items-center">
                    <img
                        src="https://picsum.photos/seed/picsum/200"
                        alt=""
                        className="rounded-full h-20 object-cover"
                    />
                </div>
                <div className="flex flex-col">
                    <div className="flex flex-row space-x-2 items-center">
                        <h1 className="tracking-wide text-2xl font-bold text-appTextStrongDark">
                            {ticker}
                        </h1>
                        {overallStockRating !== undefined ? (
                            <RatingStars rating={overallStockRating} />
                        ) : (
                            <div className="animate-pulse h-5 w-28 bg-slate-600 rounded col-span-2"></div>
                        )}
                    </div>
                    <span className="text-lg font-semibold text-appTextNormalDark">
                        {tickerData.name}
                    </span>
                    <span className="text-base font-semibold text-appTextWeakDark">
                        {tickerData.segment}
                    </span>
                </div>
            </div>
            <Kpis />
        </PageHeaderContainer>
    )
}

interface KpiProps {
    kpi: Kpi
    tickerData: Company
}

function StockHeaderKpi({ kpi, tickerData }: KpiProps) {
    return (
        <KpiCard
            kpi={kpi}
            tickerData={tickerData}
            bgTheme="dark"
            size="big"
            valueFirst={true}
            showChartIcon={false}
            showKpiDescription={false}
        />
    )
}
