import { getCoreRowModel, useReactTable } from '@tanstack/react-table'
import { getColumns } from './utils'
import TableHeader from './Header'
import TableBody from './Body'

import type { Table } from '@tanstack/react-table'
import type { Column } from './types'
import type { Stock, Company } from '../../types'

interface Props {
    data: Stock[] | Company[]
    columns: Column[]
    isTickerLink?: boolean
    lowVisibilityCols?: Column[]
    isTickerSticky?: boolean
    isHeaderGrouped?: boolean
    handleRowRemoval?: (ticker: string) => void
}

const Table = ({
    data,
    columns,
    isTickerLink = false,
    lowVisibilityCols = [],
    isTickerSticky = false,
    isHeaderGrouped = false,
    handleRowRemoval,
}: Props) => {
    const tableColumns = getColumns(columns, isHeaderGrouped, handleRowRemoval)

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
            <TableHeader
                table={table}
                isTickerSticky={isTickerSticky}
                allowRowRemoval={handleRowRemoval !== undefined}
            />
            <TableBody
                table={table}
                cssDivide={cssDivide}
                isTickerLink={isTickerLink}
                lowVisibilityCols={lowVisibilityCols}
                isTickerSticky={isTickerSticky}
                allowRowRemoval={handleRowRemoval !== undefined}
            />
        </table>
    )
}

export default Table
