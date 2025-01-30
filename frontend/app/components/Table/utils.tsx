import { createColumnHelper } from '@tanstack/react-table'
import { getKpiInfo } from '../../data/kpi'
import { getKpisByGroup, getGroupByKpi, getGroupTitle } from '../../data/group'
import { Icon } from '../ui'

import type {
    Cell,
    Header,
    ColumnHelper,
    ColumnDef,
} from '@tanstack/react-table'
import { Kpi, TableRow, KpiGroup } from '../../types'
import { NonKpi } from './types'
import type { Column } from './types'

export const getColumns = (
    columnsNames: Column[],
    isHeaderGrouped: boolean,
    handleRowRemoval?: (ticker: string) => void
) => {
    const columnHelper = createColumnHelper<TableRow>()

    const nonKpiColumns = columnsNames.filter(
        (columnName) => !isKpi(columnName)
    )
    const kpiColumns = columnsNames.filter((columnName) => isKpi(columnName))

    const columns: ColumnDef<TableRow, string | number | undefined>[] = []

    if (handleRowRemoval) {
        const columnExcludeTicker: ColumnDef<TableRow, unknown | undefined> = {
            id: 'excludeTicker',
            size: 0,
            cell: ({ row }) => (
                <div className="flex items-center justify-center">
                    <button
                        onClick={() => handleRowRemoval(row.getValue('ticker'))}
                    >
                        <Icon type="cross" size={5} />
                    </button>
                </div>
            ),
        }

        if (isHeaderGrouped) {
            columns.push(
                columnHelper.group({
                    id: 'excludeTickerHeaderGroup',
                    columns: [columnExcludeTicker],
                })
            )
        } else {
            columns.push(columnExcludeTicker)
        }
    }

    const nonKpiColumnsAcessors = nonKpiColumns.map((columnName) => {
        const accessor = columnHelper.accessor(columnName, {
            header: getNonKpiColumnMapping(columnName),
            cell: (info) => info.getValue(),
            footer: (info) => info.column.id,
        })

        return accessor
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
                        id: group,
                        header:
                            group !== KpiGroup.General
                                ? getGroupTitle(group)
                                : '',
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
    columnHelper: ColumnHelper<TableRow>
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

const getNonKpiColumnMapping = (column: NonKpi) => {
    switch (column) {
        case NonKpi.Ticker:
            return 'Ticker'
        case NonKpi.Name:
            return 'Nome'
        case NonKpi.Segment:
            return 'Segmento'
        default:
            return column
    }
}

export const getColumnStickyClass = (
    isTickerSticky: boolean,
    columnId: string,
    type: 'header' | 'cell',
    allowRowRemoval: boolean
) => {
    if (isTickerSticky) {
        const returnClasses = (
            type: 'header' | 'cell',
            leftPosition: string
        ) => {
            const defaultClass =
                'sticky shadow-[1px_0px_2px_0px_rgba(0,0,0,0.1)] z-20'

            if (type === 'header') return defaultClass + leftPosition
            else return defaultClass + leftPosition + ' bg-white'
        }

        if (columnId === 'ticker' || columnId.includes('nonKpiHeaderGroup')) {
            const leftPosition = allowRowRemoval ? ' left-14' : ' left-0'
            return returnClasses(type, leftPosition)
        } else if (
            columnId === 'excludeTicker' ||
            columnId.includes('excludeTickerHeaderGroup')
        ) {
            const leftPosition = ' left-0'
            return returnClasses(type, leftPosition)
        }
    }

    return 'relative'
}

export const getColumnStickyStyle = (
    isTickerSticky: boolean,
    columnId: string
) => {
    if (
        isTickerSticky &&
        (columnId === 'ticker' ||
            columnId.includes('nonKpiHeaderGroup') ||
            columnId === 'excludeTicker' ||
            columnId.includes('excludeTickerHeaderGroup'))
    ) {
        return { clipPath: 'inset(0 -4px 0 0)' }
    } else {
        return {}
    }
}

export const isLowerVisibilityCol = (
    cell: Cell<TableRow, unknown>,
    lowVisibilityCols: string[]
): boolean => lowVisibilityCols.includes(cell.column.id)
const isKpi = (columnName: string): columnName is Kpi =>
    Object.values(Kpi).includes(columnName as Kpi)
export const isTextCol = (
    cell: Cell<TableRow, unknown> | Header<TableRow, unknown>
): boolean => !isKpi(cell.column.id)
export const isHeaderGroup = (header: Header<TableRow, unknown>): boolean =>
    header.getLeafHeaders().length > 1
