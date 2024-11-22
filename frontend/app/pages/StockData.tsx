import { useQuery } from '@tanstack/react-query'
import { formatNum } from '../components/utils'
import StockHeader from '../components/StockHeader'
import KpiCard from '../components/KpiCard'
import { getCompany } from '../api/stocks'

import type { Company } from '../types/stocks'

interface Props {
    ticker: string | undefined
}

export default function StockData({ ticker }: Props) {
    ticker = ticker?.toUpperCase()
    const query = useQuery({
        queryKey: ['company', { ticker }],
        queryFn: () => getCompany(ticker !== undefined ? ticker : ''),
    })

    if (query.isPending)
        return <div className="font-normal text-gray-500">Loading Data...</div>

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
            />
            <div className="h-fit container">
                <div className="relative flex flex-col h-full p-6 rounded-2xl bg-white shadow shadow-grey-950/5">
                    <div className="text-gray-900 font-semibold mb-4 text-xl">
                        Indicadores
                    </div>
                    <div className="mb-0 space-y-6">
                        <ValueKpis tickerData={tickerData} />
                        <DebtKpis tickerData={tickerData} />
                        <EfficiencyKpis tickerData={tickerData} />
                        <GrowthKpis tickerData={tickerData} />
                    </div>
                </div>
            </div>
            <div className="h-fit container mt-4">
                <div className="relative flex flex-col h-full p-6 rounded-2xl bg-white shadow shadow-grey-950/5">
                    <div className="text-gray-900 font-semibold mb-4 text-xl">
                        Resultados
                    </div>
                    <div className="mb-0 space-y-6">
                        <ResultsGroup tickerData={tickerData} />
                    </div>
                </div>
            </div>
        </div>
    )
}

interface KpiGroupProps {
    groupName?: string
    kpis: { title: string; value: string }[]
}

function KpiGroup({ groupName, kpis }: KpiGroupProps) {
    return (
        <div>
            {groupName !== undefined ? (
                <div className="text-gray-700 font-semibold mb-2 text-base">
                    {groupName}
                </div>
            ) : null}
            <div className="grid grid-cols-4 mb-2 gap-4">
                {kpis.map((d, i) => (
                    <KpiCard key={i} title={d.title} value={d.value} />
                ))}
            </div>
        </div>
    )
}

function ValueKpis({ tickerData }: { tickerData: Company }) {
    return (
        <KpiGroup
            groupName="Valor"
            kpis={[
                {
                    title: 'P/L',
                    value: formatNum(tickerData.pl, 'decimal'),
                },
                {
                    title: 'P/VP',
                    value: formatNum(tickerData.pvp, 'decimal'),
                },
                {
                    title: 'Dividend Yield',
                    value: formatNum(tickerData.dividendYield, 'percent'),
                },
                {
                    title: 'Dividend Payout',
                    value: formatNum(tickerData.dividendPayout, 'percent'),
                },
                {
                    title: 'Valor de Mercado',
                    value: formatNum(tickerData.marketCap, 'currency'),
                },
                {
                    title: 'Preço Bazin',
                    value: formatNum(tickerData.bazinPrice, 'currencyDecimal'),
                },
            ]}
        />
    )
}

function DebtKpis({ tickerData }: { tickerData: Company }) {
    return (
        <KpiGroup
            groupName="Endividamento"
            kpis={[
                {
                    title: 'Dívida Líquida / EBIT',
                    value: formatNum(tickerData.netDebtByEbit, 'decimal'),
                },
                {
                    title: 'Dívida Líquida / Patrimônio',
                    value: formatNum(tickerData.netDebtByEquity, 'decimal'),
                },
            ]}
        />
    )
}

function EfficiencyKpis({ tickerData }: { tickerData: Company }) {
    return (
        <KpiGroup
            groupName="Eficiência"
            kpis={[
                {
                    title: 'Margem Líquida',
                    value: formatNum(tickerData.netMargin, 'percent'),
                },
                {
                    title: 'RoE',
                    value: formatNum(tickerData.roe, 'percent'),
                },
            ]}
        />
    )
}

function GrowthKpis({ tickerData }: { tickerData: Company }) {
    return (
        <KpiGroup
            groupName="Crescimento"
            kpis={[
                {
                    title: 'CAGR Lucros - 5 anos',
                    value: formatNum(tickerData.cagr5YearsProfit, 'percent'),
                },
                {
                    title: 'CAGR Receitas - 5 anos',
                    value: formatNum(tickerData.cagr5YearsRevenue, 'percent'),
                },
            ]}
        />
    )
}

function ResultsGroup({ tickerData }: { tickerData: Company }) {
    return (
        <KpiGroup
            kpis={[
                {
                    title: 'Patrimônio',
                    value: formatNum(tickerData.equity, 'currency'),
                },
                {
                    title: 'Receitas',
                    value: formatNum(tickerData.netRevenue, 'currency'),
                },
                {
                    title: 'Lucro',
                    value: formatNum(tickerData.profit, 'currency'),
                },
                {
                    title: 'EBIT',
                    value: formatNum(tickerData.ebit, 'currency'),
                },
                {
                    title: 'Dívida Bruta',
                    value: formatNum(tickerData.debt, 'currency'),
                },
                {
                    title: 'Dívida Líquida',
                    value: formatNum(tickerData.netDebt, 'currency'),
                },
            ]}
        />
    )
}
