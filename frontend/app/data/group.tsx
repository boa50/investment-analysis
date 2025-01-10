import { getObjectKeys } from '../components/utils'

import { KpiGroup, Kpi } from '../types'

type KpiGroups = {
    [key in KpiGroup]: Kpi[]
}

const kpiGroups: KpiGroups = {
    [KpiGroup.Value]: [
        Kpi.PriceProfit,
        Kpi.PriceEquity,
        Kpi.DividendYield,
        Kpi.DividendPayout,
        Kpi.MarketCap,
        Kpi.BazinPrice,
    ],
    [KpiGroup.Debt]: [Kpi.NetDebtByEbit, Kpi.NetDebtByEquity],
    [KpiGroup.Efficiency]: [Kpi.NetMargin, Kpi.Roe],
    [KpiGroup.Growth]: [Kpi.Cagr5YearsProfit, Kpi.Cagr5YearsRevenue],
    [KpiGroup.Results]: [
        Kpi.Equity,
        Kpi.NetRevenue,
        Kpi.Profit,
        Kpi.Ebit,
        Kpi.Debt,
        Kpi.NetDebt,
    ],
    [KpiGroup.General]: [Kpi.OverallRating],
}

export const getKpisByGroup = (group: KpiGroup) => {
    return kpiGroups[group]
}

export const getGroupByKpi = (kpi: Kpi) => {
    return getObjectKeys(kpiGroups).find((group) =>
        kpiGroups[group].includes(kpi)
    )
}

export const getGroupTitle = (group: KpiGroup) => {
    switch (group) {
        case KpiGroup.Value:
            return 'Valor'
        case KpiGroup.Debt:
            return 'Endividamento'
        case KpiGroup.Efficiency:
            return 'Eficiência'
        case KpiGroup.Growth:
            return 'Crescimento'
        case KpiGroup.Results:
            return 'Resultado'
        case KpiGroup.General:
            return 'General'

        default:
            return ''
    }
}
