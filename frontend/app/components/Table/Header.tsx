import { flexRender } from '@tanstack/react-table'
import { isHeaderGroup, isTextCol, getColumnStickyClass } from './utils'

import type { Table } from '@tanstack/react-table'
import type { Stock, Company } from '../../types'

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

export default TableHeader