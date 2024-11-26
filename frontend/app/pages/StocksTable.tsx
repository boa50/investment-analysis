import {
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    useReactTable,
} from '@tanstack/react-table'
import { useQuery } from '@tanstack/react-query'
import { Link } from '@remix-run/react'
import { getStocks } from '../api/stocks'
import { formatNum } from '../components/utils'
import PageHeaderContainer from '../components/PageHeaderContainer'

import type { Cell, Header } from '@tanstack/react-table'
import type { Stock } from '../types/stocks'

const isLowerVisibilityCol = (cell: Cell<Stock, unknown>): boolean =>
    cell.column.id === 'segment'
const isTextCol = (
    cell: Cell<Stock, unknown> | Header<Stock, unknown>
): boolean => ['ticker', 'name', 'segment'].includes(cell.column.id)

const columnHelper = createColumnHelper<Stock>()

const columns = [
    columnHelper.accessor('ticker', {
        header: 'Ticker',
        cell: (info) => info.getValue(),
        footer: (info) => info.column.id,
    }),
    columnHelper.accessor('name', {
        header: 'Name',
        cell: (info) => info.getValue(),
        footer: (info) => info.column.id,
    }),
    columnHelper.accessor('segment', {
        header: 'Segment',
        cell: (info) => info.getValue(),
        footer: (info) => info.column.id,
    }),
    columnHelper.accessor('marketCap', {
        header: 'Market Cap',
        cell: (info) => formatNum(info.getValue(), 'currency'),
        footer: (info) => info.column.id,
    }),
    columnHelper.accessor('pl', {
        header: 'P/E',
        cell: (info) => formatNum(info.getValue(), 'decimal'),
        footer: (info) => info.column.id,
    }),
    columnHelper.accessor('netMargin', {
        header: 'Net Margin',
        cell: (info) => formatNum(info.getValue(), 'percent'),
        footer: (info) => info.column.id,
    }),
]

function StockTableCell({ cell }: { cell: Cell<Stock, unknown> }) {
    const className =
        'px-4 py-3 text-sm font-medium' +
        (isLowerVisibilityCol(cell)
            ? ' text-appTextWeak'
            : ' text-appTextNormal') +
        (cell.column.id === 'ticker' ? ' hover:text-appAccent' : '') +
        (isTextCol(cell) ? ' text-left' : ' text-right')
    const cellText = flexRender(cell.column.columnDef.cell, cell.getContext())

    return (
        <td className={className}>
            {cell.column.id === 'ticker' ? (
                <Link to={'/stock/' + cell.getValue()}>{cellText}</Link>
            ) : (
                cellText
            )}
        </td>
    )
}

export default function StockTable() {
    const query = useQuery({ queryKey: ['stocks'], queryFn: getStocks })

    const table = useReactTable({
        data: query.data !== undefined ? query.data : [],
        columns,
        getCoreRowModel: getCoreRowModel(),
    })

    const cssDivide = 'divide-y divide-appRowDivider'

    if (query.isPending)
        return (
            <div className="font-normal text-appTextWeak">Loading Data...</div>
        )

    if (query.error)
        return (
            <div className="font-normal text-red-500">
                An error has occurred while loading data: {query.error.message}
            </div>
        )

    return (
        <div className="w-screen pb-4">
            <PageHeaderContainer>
                <h1 className="text-4xl font-bold text-appTextStrongDark">
                    Lista de Ações
                </h1>
            </PageHeaderContainer>
            <div className="px-8 flex w-screen items-center justify-center">
                <div className="overflow-hidden border border-gray-300 md:rounded-lg">
                    <table className={cssDivide}>
                        <thead>
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
                                                      header.column.columnDef
                                                          .header,
                                                      header.getContext()
                                                  )}
                                        </th>
                                    ))}
                                </tr>
                            ))}
                        </thead>
                        <tbody className={cssDivide + ' bg-white'}>
                            {table.getRowModel() !== undefined
                                ? table.getRowModel().rows.map((row) => (
                                      <tr
                                          key={row.id}
                                          className="hover:bg-gray-100"
                                      >
                                          {row.getVisibleCells().map((cell) => (
                                              <StockTableCell
                                                  key={cell.id}
                                                  cell={cell}
                                              />
                                          ))}
                                      </tr>
                                  ))
                                : null}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
