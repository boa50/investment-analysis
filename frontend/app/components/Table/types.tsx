import type { Kpi } from '../../types'

export enum NonKpi {
    Ticker = 'ticker',
    Name = 'name',
    Segment = 'segment',
    // OverallRating = 'overallRating'
}

export type Column = NonKpi | Kpi
