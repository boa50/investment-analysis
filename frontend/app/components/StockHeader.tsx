import { formatNum } from './utils'
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
}

export default function StockHeader({
    ticker,
    name,
    segment,
    price,
    pl,
    dividendYield,
}: Props) {
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
                        <h1 className="tracking-wide text-2xl font-bold text-gray-100">
                            {ticker}
                        </h1>
                        <RatingStars rating={3} />
                    </div>
                    <span className="text-lg font-semibold text-gray-100">
                        {name}
                    </span>
                    <span className="text-base font-semibold text-gray-400">
                        {segment}
                    </span>
                </div>
            </div>
            <div className="grid grid-cols-3 gap-4 flex items-center">
                <StockHeaderKpi
                    title="Preço"
                    value={formatNum(price, 'currencyDecimal')}
                />
                <StockHeaderKpi title="P/L" value={formatNum(pl, 'decimal')} />
                <StockHeaderKpi
                    title="Dividend Yield"
                    value={formatNum(dividendYield, 'percent')}
                />
            </div>
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
