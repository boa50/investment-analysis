import type { Kpi } from '../../types'

export enum nonKpi {
    Ticker = 'ticker',
    Name = 'name',
    Segment = 'segment',
}

export type Column = nonKpi | Kpi
