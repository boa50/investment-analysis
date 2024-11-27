import { getMockCompany } from './utils'
import { getKpiInfo } from '../data/kpi'
import KpiCard from './KpiCard'
import RatingStars from './RatingStars'
import PageHeaderContainer from './PageHeaderContainer'

interface Props {
    ticker: string | undefined
    name: string
    segment: string
    price: number
    pl: number
    dividendYield: number
    rating: number
}

export default function StockHeader({
    ticker,
    name,
    segment,
    price,
    pl,
    dividendYield,
    rating,
}: Props) {
    const tickerData = getMockCompany({ price, pl, dividendYield })

    const Kpis = () => {
        const kpiPrice = getKpiInfo(tickerData, 'price')
        const kpiPl = getKpiInfo(tickerData, 'pl')
        const kpiDy = getKpiInfo(tickerData, 'dividendYield')

        return (
            <div className="grid grid-cols-3 gap-4 flex items-center">
                <StockHeaderKpi title={kpiPrice.title} value={kpiPrice.value} />
                <StockHeaderKpi title={kpiPl.title} value={kpiPl.value} />
                <StockHeaderKpi title={kpiDy.title} value={kpiDy.value} />
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
                        <RatingStars rating={rating} />
                    </div>
                    <span className="text-lg font-semibold text-appTextNormalDark">
                        {name}
                    </span>
                    <span className="text-base font-semibold text-appTextWeakDark">
                        {segment}
                    </span>
                </div>
            </div>
            <Kpis />
        </PageHeaderContainer>
    )
}

interface KpiProps {
    title: string
    value: string
}

function StockHeaderKpi({ title, value }: KpiProps) {
    return (
        <KpiCard
            title={title}
            value={value}
            bgTheme="dark"
            size="big"
            valueFirst={true}
        />
    )
}
