import { useState } from 'react'
import { getCoreRowModel, useReactTable, SortingState, getSortedRowModel } from '@tanstack/react-table'
import { getColumns } from './utils'
import TableHeader from './Header'
import TableBody from './Body'

import type { Table, Cell } from '@tanstack/react-table'
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
    handleRowHovered?: (rowCells: Cell<Stock | Company, unknown>[]) => void
    handleRowUnhovered?: (rowCells: Cell<Stock | Company, unknown>[]) => void
}

const Table = ({
    data,
    columns,
    isTickerLink = false,
    lowVisibilityCols = [],
    isTickerSticky = false,
    isHeaderGrouped = false,
    handleRowRemoval,
    handleRowHovered,
    handleRowUnhovered,
}: Props) => {
    const tableColumns = getColumns(columns, isHeaderGrouped, handleRowRemoval)
    const [sorting, setSorting] = useState<SortingState>([])

    const table = useReactTable({
        data,
        columns: tableColumns,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(), // client-side sorting
        onSortingChange: setSorting,
        state: {
            sorting,
          },
    })

    const cssDivide = 'divide-y divide-appRowDivider relative'

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
                handleRowHovered={handleRowHovered}
                handleRowUnhovered={handleRowUnhovered}
            />
        </table>
    )
}

export default Table
