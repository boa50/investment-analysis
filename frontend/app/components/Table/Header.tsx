import { flexRender } from '@tanstack/react-table'
import {
    isHeaderGroup,
    isTextCol,
    getColumnStickyClass,
    getColumnStickyStyle,
} from './utils'
import { Icon } from '../ui'

import type { Table } from '@tanstack/react-table'
import type { TableRow } from '../../types'

interface TableHeaderProps {
    table: Table<TableRow>
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
                            onClick={header.column.getToggleSortingHandler()}
                            className={`px-4 py-3.5 text-xs font-normal text-appTextWeak bg-gray-200 ${
                                isHeaderGroup(header)
                                    ? i > (allowRowRemoval ? 1 : 0) &&
                                      i < headerGroup.headers.length - 1
                                        ? 'after:border after:border-gray-300 after:absolute after:right-0 after:top-0 after:h-[6rem] after:z-10'
                                        : ''
                                    : ''
                            }
                                ${
                                    header.column.getCanSort()
                                        ? 'cursor-pointer select-none'
                                        : ''
                                }
                                ${getColumnStickyClass(isTickerSticky, header.id, 'header', allowRowRemoval)}`}
                            style={getColumnStickyStyle(
                                isTickerSticky,
                                header.id
                            )}
                        >
                            {header.isPlaceholder ? null : (
                                <div
                                    className={`flex items-center
                                    ${
                                        isHeaderGroup(header)
                                            ? 'justify-center'
                                            : isTextCol(header)
                                              ? 'text-left justify-start'
                                              : 'text-right justify-start flex-row-reverse'
                                    }`}
                                >
                                    {flexRender(
                                        header.column.columnDef.header,
                                        header.getContext()
                                    )}
                                    {{
                                        asc: (
                                            <span className="rotate-180">
                                                <Icon type="arrowDown" />
                                            </span>
                                        ),
                                        desc: (
                                            <span>
                                                <Icon type="arrowDown" />
                                            </span>
                                        ),
                                    }[
                                        header.column.getIsSorted() as string
                                    ] ?? <span className="w-5 h-5"></span>}
                                </div>
                            )}
                        </th>
                    ))}
                </tr>
            ))}
        </thead>
    )
}

export default TableHeader
