import {
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    useReactTable,
} from '@tanstack/react-table'
import { Link } from '@remix-run/react'
import { getKpiInfo } from '../data/kpi'

import type { Table, Cell, Header } from '@tanstack/react-table'
import type { Stock, Company, Kpi } from '../types'

type Column = 'ticker' | 'name' | 'segment' | Kpi

const isLowerVisibilityCol = (
    cell: Cell<Stock | Company, unknown>,
    lowVisibilityCols: string[]
): boolean => lowVisibilityCols.includes(cell.column.id)
const isKpi = (columnName: string): columnName is Kpi =>
    !['ticker', 'name', 'segment'].includes(columnName)
const isTextCol = (
    cell: Cell<Stock | Company, unknown> | Header<Stock | Company, unknown>
): boolean => !isKpi(cell.column.id)

const getColumns = (columnsNames: Column[]) => {
    const columnHelper = createColumnHelper<Stock | Company>()

    const columns = columnsNames.map((columnName) => {
        if (isKpi(columnName)) {
            return columnHelper.accessor(columnName, {
                header: getKpiInfo(columnName).title,
                cell: (info) =>
                    getKpiInfo(columnName).valueFormat(
                        info.getValue() as number | undefined
                    ),
                footer: (info) => info.column.id,
            })
        } else {
            return columnHelper.accessor(columnName, {
                header: getTextColumnMapping(columnName),
                cell: (info) => info.getValue(),
                footer: (info) => info.column.id,
            })
        }
    })

    return columns
}

interface Props {
    data: Stock[] | Company[]
    columns: Column[]
    isTickerLink?: boolean
    lowVisibilityCols?: Column[]
}

export default function Table({
    data,
    columns,
    isTickerLink = false,
    lowVisibilityCols = [],
}: Props) {
    const tableColumns = getColumns(columns)

    const table = useReactTable({
        data,
        columns: tableColumns,
        getCoreRowModel: getCoreRowModel(),
    })

    const cssDivide = 'divide-y divide-appRowDivider'

    return (
        <table className={cssDivide + ' w-full'}>
            <TableHeader table={table} />
            <TableBody
                table={table}
                cssDivide={cssDivide}
                isTickerLink={isTickerLink}
                lowVisibilityCols={lowVisibilityCols}
            />
        </table>
    )
}

interface TableHeaderProps {
    table: Table<Stock | Company>
}

function TableHeader({ table }: TableHeaderProps) {
    return (
        <thead className="bg-appBackground sticky top-0 z-10">
            {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                        <th
                            key={header.id}
                            className={
                                'px-4 py-3.5 text-xs font-normal text-appTextWeak' +
                                (isTextCol(header)
                                    ? ' text-left'
                                    : ' text-right')
                            }
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
}

function TableCell({ cell, isTickerLink, lowVisibilityCols }: TableCellProps) {
    const isCellLink = isTickerLink && cell.column.id === 'ticker'
    const className =
        'px-4 py-3 text-sm font-medium' +
        (isLowerVisibilityCol(cell, lowVisibilityCols)
            ? ' text-appTextWeak'
            : ' text-appTextNormal') +
        (isCellLink ? ' hover:text-appAccent' : '') +
        (isTextCol(cell) ? ' text-left' : ' text-right')
    const cellText = flexRender(cell.column.columnDef.cell, cell.getContext())

    return (
        <td className={className}>
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
}

function TableBody({
    table,
    cssDivide,
    isTickerLink,
    lowVisibilityCols,
}: TableBodyProps) {
    return (
        <tbody className={cssDivide + ' bg-white overflow-y-scroll'}>
            {table.getRowModel()?.rows.map((row) => (
                <tr key={row.id} className="hover:bg-gray-100">
                    {row.getVisibleCells().map((cell) => (
                        <TableCell
                            key={cell.id}
                            cell={cell}
                            isTickerLink={isTickerLink}
                            lowVisibilityCols={lowVisibilityCols}
                        />
                    ))}
                </tr>
            ))}
        </tbody>
    )
}

function getTextColumnMapping(column: string) {
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
