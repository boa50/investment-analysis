import { flexRender } from '@tanstack/react-table'
import { Link } from '@remix-run/react'
import { isLowerVisibilityCol, isTextCol, getColumnStickyClass } from './utils'

import type { Cell } from '@tanstack/react-table'
import type { Column } from './types'
import type { Stock } from '../../types'

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

export default TableCell
