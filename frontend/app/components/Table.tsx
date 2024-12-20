import {
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    useReactTable,
} from '@tanstack/react-table'
import { Link } from '@remix-run/react'
import { getKpiInfo } from '../data/kpi'
import { getKpisByGroup, getGroupByKpi, getGroupTitle } from '../data/group'

import { Kpi } from '../types'
import type { Table, Cell, Header, ColumnHelper } from '@tanstack/react-table'
import type { Stock, Company, KpiGroup } from '../types'

type Column = 'ticker' | 'name' | 'segment' | Kpi

interface Props {
    data: Stock[] | Company[]
    columns: Column[]
    isTickerLink?: boolean
    lowVisibilityCols?: Column[]
    isTickerSticky?: boolean
    isHeaderGrouped?: boolean
}

export default function Table({
    data,
    columns,
    isTickerLink = false,
    lowVisibilityCols = [],
    isTickerSticky = false,
    isHeaderGrouped = false,
}: Props) {
    const tableColumns = getColumns(columns, isHeaderGrouped)

    const table = useReactTable({
        data,
        columns: tableColumns,
        getCoreRowModel: getCoreRowModel(),
    })

    const cssDivide = 'divide-y divide-appRowDivider'

    return (
        <table
            className={cssDivide}
            style={{
                width: table.getTotalSize(),
            }}
        >
            <TableHeader table={table} isTickerSticky={isTickerSticky} />
            <TableBody
                table={table}
                cssDivide={cssDivide}
                isTickerLink={isTickerLink}
                lowVisibilityCols={lowVisibilityCols}
                isTickerSticky={isTickerSticky}
            />
        </table>
    )
}

interface TableHeaderProps {
    table: Table<Stock | Company>
    isTickerSticky: boolean
}

const TableHeader = ({ table, isTickerSticky }: TableHeaderProps) => {
    return (
        <thead className="sticky top-0 z-10">
            {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                        <th
                            key={header.id}
                            colSpan={header.colSpan}
                            className={`px-4 py-3.5 text-xs font-normal text-appTextWeak bg-gray-200 
                                ${!isHeaderGroup(header) ? (isTextCol(header) ? 'text-left' : 'text-right') : ''} 
                                ${getColumnStickyClass(isTickerSticky, header.id, 'header')}`}
                        >
                            {header.isPlaceholder
                                ? null
                                : flexRender(
                                      header.column.columnDef.header,
                                      header.getContext()
                                  )}
                        </th>
                    ))}
                </tr>
            ))}
        </thead>
    )
}

interface TableCellProps {
    cell: Cell<Stock, unknown>
    isTickerLink: boolean
    lowVisibilityCols: Column[]
    isTickerSticky: boolean
}

const TableCell = ({
    cell,
    isTickerLink,
    lowVisibilityCols,
    isTickerSticky,
}: TableCellProps) => {
    const isCellLink = isTickerLink && cell.column.id === 'ticker'
    const className =
        'px-4 py-3 text-sm font-medium group-hover:bg-gray-100' +
        (isLowerVisibilityCol(cell, lowVisibilityCols)
            ? ' text-appTextWeak'
            : ' text-appTextNormal') +
        (isCellLink ? ' hover:text-appAccent' : '') +
        (isTextCol(cell) ? ' text-left' : ' text-right')
    const cellText = flexRender(cell.column.columnDef.cell, cell.getContext())

    return (
        <td
            className={`${className} ${getColumnStickyClass(isTickerSticky, cell.column.id, 'cell')}`}
        >
            {isCellLink ? (
                <Link to={'/stock/' + cell.getValue()}>{cellText}</Link>
            ) : (
                cellText
            )}
        </td>
    )
}

interface TableBodyProps {
    table: Table<Stock | Company>
    cssDivide: string
    isTickerLink: boolean
    lowVisibilityCols: Column[]
    isTickerSticky: boolean
}

const TableBody = ({
    table,
    cssDivide,
    isTickerLink,
    lowVisibilityCols,
    isTickerSticky,
}: TableBodyProps) => {
    return (
        <tbody className={cssDivide + ' bg-white overflow-y-scroll'}>
            {table.getRowModel()?.rows.map((row) => (
                <tr key={row.id} className="group">
                    {row.getVisibleCells().map((cell) => (
                        <TableCell
                            key={cell.id}
                            cell={cell}
                            isTickerLink={isTickerLink}
                            lowVisibilityCols={lowVisibilityCols}
                            isTickerSticky={isTickerSticky}
                        />
                    ))}
                </tr>
            ))}
        </tbody>
    )
}

const getColumns = (columnsNames: Column[], isHeaderGrouped: boolean) => {
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

const getColumnStickyClass = (
    isTickerSticky: boolean,
    columnId: string,
    type: 'header' | 'cell'
) => {
    if (
        isTickerSticky &&
        (columnId === 'ticker' || columnId.includes('nonKpiHeaderGroup'))
    ) {
        if (type === 'header') {
            return 'sticky z-20 left-0'
        } else {
            return 'sticky z-20 left-0 bg-white'
        }
    } else {
        return 'relative'
    }
}

const isLowerVisibilityCol = (
    cell: Cell<Stock | Company, unknown>,
    lowVisibilityCols: string[]
): boolean => lowVisibilityCols.includes(cell.column.id)
const isKpi = (columnName: string): columnName is Kpi =>
    Object.values(Kpi).includes(columnName as Kpi)
const isTextCol = (
    cell: Cell<Stock | Company, unknown> | Header<Stock | Company, unknown>
): boolean => !isKpi(cell.column.id)
const isHeaderGroup = (header: Header<Stock | Company, unknown>): boolean =>
    header.subHeaders !== undefined
