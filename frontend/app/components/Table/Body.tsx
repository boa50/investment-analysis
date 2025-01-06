import TableCell from './Cell'

import type { Table, Cell } from '@tanstack/react-table'
import type { Column } from './types'
import type { TableRow } from '../../types'

interface TableBodyProps {
    table: Table<TableRow>
    cssDivide: string
    isTickerLink: boolean
    lowVisibilityCols: Column[]
    isTickerSticky: boolean
    allowRowRemoval: boolean
    handleRowHovered?: (rowCells: Cell<TableRow, unknown>[]) => void
    handleRowUnhovered?: (rowCells: Cell<TableRow, unknown>[]) => void
}

const TableBody = ({
    table,
    cssDivide,
    isTickerLink,
    lowVisibilityCols,
    isTickerSticky,
    allowRowRemoval,
    handleRowHovered,
    handleRowUnhovered,
}: TableBodyProps) => {
    return (
        <tbody className={cssDivide + ' bg-white overflow-y-scroll'}>
            {table.getRowModel()?.rows.map((row) => (
                <tr
                    key={row.id}
                    className="group"
                    onMouseEnter={() =>
                        handleRowHovered !== undefined
                            ? handleRowHovered(row.getVisibleCells())
                            : undefined
                    }
                    onMouseLeave={() =>
                        handleRowUnhovered !== undefined
                            ? handleRowUnhovered(row.getVisibleCells())
                            : undefined
                    }
                >
                    {row.getVisibleCells().map((cell) => (
                        <TableCell
                            key={cell.id}
                            cell={cell}
                            isTickerLink={isTickerLink}
                            lowVisibilityCols={lowVisibilityCols}
                            isTickerSticky={isTickerSticky}
                            allowRowRemoval={allowRowRemoval}
                        />
                    ))}
                </tr>
            ))}
        </tbody>
    )
}

export default TableBody
