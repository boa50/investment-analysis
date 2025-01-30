import { useQuery } from '@tanstack/react-query'
import { getStocks } from '../api/stocks'
import PageHeaderContainer from '../components/PageHeaderContainer'
import Table from '../components/Table'
import CenteredInfo from '../components/CenteredInfo'
import { LoaderAnimation } from '../components/ui'

import { Kpi } from '../types'
import { NonKpi } from '../components/Table/types'

export default function StocksTable() {
    const query = useQuery({ queryKey: ['stocks'], queryFn: getStocks })

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

    return (
        <div className="w-screen pb-4">
            <PageHeaderContainer>
                <h1 className="text-4xl font-bold text-appTextStrongDark">
                    Lista de Ações
                </h1>
            </PageHeaderContainer>
            <div className="container flex items-center justify-center">
                <div className="overflow-auto h-[48rem] border border-gray-300 md:rounded-lg z-0">
                    <Table
                        data={query.data}
                        columns={[
                            NonKpi.Ticker,
                            NonKpi.Name,
                            NonKpi.Segment,
                            Kpi.MarketCap,
                            Kpi.PriceProfit,
                            Kpi.NetMargin,
                        ]}
                        isTickerLink={true}
                        lowVisibilityCols={[NonKpi.Segment]}
                    />
                </div>
            </div>
        </div>
    )
}
