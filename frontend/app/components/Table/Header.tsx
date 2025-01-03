import { flexRender } from '@tanstack/react-table'
import {
    isHeaderGroup,
    isTextCol,
    getColumnStickyClass,
    getColumnStickyStyle,
} from './utils'

import type { Table } from '@tanstack/react-table'
import type { Stock, Company } from '../../types'

interface TableHeaderProps {
    table: Table<Stock | Company>
    isTickerSticky: boolean
    allowRowRemoval: boolean
}

const TableHeader = ({
    table,
    isTickerSticky,
    allowRowRemoval,
}: TableHeaderProps) => {
    return (
        <thead className="sticky top-0 z-30">
            {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header, i) => (
                        <th
                            key={header.id}
                            colSpan={header.colSpan}
                            className={`px-4 py-3.5 text-xs font-normal text-appTextWeak bg-gray-200 ${
                                isHeaderGroup(header)
                                    ? i > (allowRowRemoval ? 1 : 0) &&
                                      i < headerGroup.headers.length - 1
                                        ? 'after:border after:border-gray-300 after:absolute after:right-0 after:top-0 after:h-[5.5rem] after:z-10'
                                        : ''
                                    : isTextCol(header)
                                      ? 'text-left'
                                      : 'text-right'
                            } 
                                ${getColumnStickyClass(isTickerSticky, header.id, 'header', allowRowRemoval)}`}
                            style={getColumnStickyStyle(
                                isTickerSticky,
                                header.id
                            )}
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
