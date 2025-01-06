import { flexRender } from '@tanstack/react-table'
import { Link } from '@remix-run/react'
import {
    isLowerVisibilityCol,
    isTextCol,
    getColumnStickyClass,
    getColumnStickyStyle,
} from './utils'

import type { Cell } from '@tanstack/react-table'
import type { Column } from './types'
import type { TableRow } from '../../types'

interface TableCellProps {
    cell: Cell<TableRow, unknown>
    isTickerLink: boolean
    lowVisibilityCols: Column[]
    isTickerSticky: boolean
    allowRowRemoval: boolean
}

const TableCell = ({
    cell,
    isTickerLink,
    lowVisibilityCols,
    isTickerSticky,
    allowRowRemoval,
}: TableCellProps) => {
    const isCellLink = isTickerLink && cell.column.id === 'ticker'
    const isCellTickerRemove = cell.column.id === 'excludeTicker'
    const className = `${!isCellTickerRemove ? 'px-4 py-3' : 'w-8'} text-sm font-medium group-hover:bg-gray-100 
        ${
            isLowerVisibilityCol(cell, lowVisibilityCols)
                ? 'text-appTextWeak'
                : 'text-appTextNormal'
        } 
        ${isCellLink ? ' hover:text-appAccent' : ''} 
        ${isTextCol(cell) ? ' text-left' : ' text-right'}`
    const cellText = flexRender(cell.column.columnDef.cell, cell.getContext())

    return (
        <td
            className={`${className} ${getColumnStickyClass(isTickerSticky, cell.column.id, 'cell', allowRowRemoval)}`}
            style={getColumnStickyStyle(isTickerSticky, cell.column.id)}
        >
            {isCellLink ? (
                <Link to={'/stock/' + cell.getValue()}>{cellText}</Link>
            ) : (
                cellText
            )}
        </td>
    )
}

export default TableCell
