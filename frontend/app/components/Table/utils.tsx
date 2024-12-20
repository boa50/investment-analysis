import { createColumnHelper } from '@tanstack/react-table'
import { getKpiInfo } from '../../data/kpi'
import { getKpisByGroup, getGroupByKpi, getGroupTitle } from '../../data/group'

import { Kpi } from '../../types'
import type { Cell, Header, ColumnHelper } from '@tanstack/react-table'
import type { Stock, Company, KpiGroup } from '../../types'

type Column = 'ticker' | 'name' | 'segment' | Kpi

export const getColumns = (
    columnsNames: Column[],
    isHeaderGrouped: boolean
) => {
    const columnHelper = createColumnHelper<Stock | Company>()

    const nonKpiColumns = columnsNames.filter(
        (columnName) => !isKpi(columnName)
    )
    const kpiColumns = columnsNames.filter((columnName) => isKpi(columnName))

    const columns = []

    const nonKpiColumnsAcessors = nonKpiColumns.map((columnName) => {
        return columnHelper.accessor(columnName, {
            header: getTextColumnMapping(columnName),
            cell: (info) => info.getValue(),
            footer: (info) => info.column.id,
        })
    })
    if (isHeaderGrouped) {
        columns.push(
            columnHelper.group({
                id: 'nonKpiHeaderGroup',
                columns: nonKpiColumnsAcessors,
            })
        )

        const groupsToInclude = [
            ...new Set(kpiColumns.map((kpiColumn) => getGroupByKpi(kpiColumn))),
        ]

        groupsToInclude
            .filter((group) => group !== undefined)
            .forEach((group) => {
                const groupKpis = getColumnsByGroup(
                    group,
                    kpiColumns,
                    columnHelper
                )

                columns.push(
                    columnHelper.group({
                        header: getGroupTitle(group),
                        columns: groupKpis,
                    })
                )
            })
    } else {
        columns.push(...nonKpiColumnsAcessors)

        kpiColumns.forEach((columnName) => {
            columns.push(
                columnHelper.accessor(columnName, {
                    header: getKpiInfo(columnName).title,
                    cell: (info) =>
                        getKpiInfo(columnName).valueFormat(
                            info.getValue() as number | undefined
                        ),
                    footer: (info) => info.column.id,
                })
            )
        })
    }

    return columns
}

const getColumnsByGroup = (
    group: KpiGroup,
    columnsNames: Column[],
    columnHelper: ColumnHelper<Stock | Company>
) => {
    const groupKpis = getKpisByGroup(group)
    const columnsToInclude = groupKpis.filter((groupKpi) =>
        columnsNames.some((columnName) => groupKpi === columnName)
    )

    const columns = columnsToInclude.map((columnName) =>
        columnHelper.accessor(columnName, {
            header: getKpiInfo(columnName).title,
            cell: (info) =>
                getKpiInfo(columnName).valueFormat(
                    info.getValue() as number | undefined
                ),
            footer: (info) => info.column.id,
        })
    )

    return columns
}

const getTextColumnMapping = (column: string) => {
    switch (column) {
        case 'ticker':
            return 'Ticker'
        case 'name':
            return 'Nome'
        case 'segment':
            return 'Segmento'
        default:
            return column
    }
}

export const getColumnStickyClass = (
    isTickerSticky: boolean,
    columnId: string,
    type: 'header' | 'cell'
) => {
    if (
        isTickerSticky &&
        (columnId === 'ticker' || columnId.includes('nonKpiHeaderGroup'))
    ) {
        const defaultClass =
            'sticky z-20 left-0 shadow-[1px_0px_2px_0px_rgba(0,0,0,0.1)]'
        if (type === 'header') {
            return defaultClass
        } else {
            return defaultClass + ' bg-white'
        }
    } else {
        return 'relative'
    }
}

export const getColumnStickyStyle = (
    isTickerSticky: boolean,
    columnId: string
) => {
    if (
        isTickerSticky &&
        (columnId === 'ticker' || columnId.includes('nonKpiHeaderGroup'))
    ) {
        return { clipPath: 'inset(0 -4px 0 0)' }
    } else {
        return {}
    }
}

export const isLowerVisibilityCol = (
    cell: Cell<Stock | Company, unknown>,
    lowVisibilityCols: string[]
): boolean => lowVisibilityCols.includes(cell.column.id)
const isKpi = (columnName: string): columnName is Kpi =>
    Object.values(Kpi).includes(columnName as Kpi)
export const isTextCol = (
    cell: Cell<Stock | Company, unknown> | Header<Stock | Company, unknown>
): boolean => !isKpi(cell.column.id)
export const isHeaderGroup = (
    header: Header<Stock | Company, unknown>
): boolean => header.subHeaders !== undefined
