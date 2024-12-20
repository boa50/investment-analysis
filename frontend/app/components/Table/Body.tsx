import TableCell from './Cell'

import type { Table } from '@tanstack/react-table'
import type { Column } from './types'
import type { Stock, Company } from '../../types'

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

export default TableBody
