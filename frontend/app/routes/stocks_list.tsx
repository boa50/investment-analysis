import { useState, useEffect } from 'react';
import {
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    useReactTable,
} from '@tanstack/react-table'
import {
    QueryClient,
    QueryClientProvider,
    useQuery,
} from '@tanstack/react-query'
import type { Cell, Header } from '@tanstack/react-table';
import type { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
    return [
        { title: "Investment Analysis - Stocks List" },
        { name: "description", content: "List of the stocks" },
    ];
};

type Stock = {
    ticker: string;
    name: string;
    segment: string;
    marketCap: number;
    pl: number;
    netMargin: number;
}

const formatDecimal = (num: number): string => num.toFixed(2)
const formatCurrency = (num: number): string => (new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", notation: 'compact' })).format(num)
const formatPercent = (num: number): string => formatDecimal(num * 100) + '%'

const columnHelper = createColumnHelper<Stock>()

const columns = [
    columnHelper.accessor('ticker', {
        header: 'Ticker',
        cell: info => info.getValue(),
        footer: info => info.column.id,
    }),
    columnHelper.accessor('name', {
        header: 'Name',
        cell: info => info.getValue(),
        footer: info => info.column.id,
    }),
    columnHelper.accessor('segment', {
        header: 'Segment',
        cell: info => info.getValue(),
        footer: info => info.column.id,
    }),
    columnHelper.accessor('marketCap', {
        header: 'Market Cap',
        cell: info => formatCurrency(info.getValue()),
        footer: info => info.column.id,
    }),
    columnHelper.accessor('pl', {
        header: 'P/E',
        cell: info => formatDecimal(info.getValue()),
        footer: info => info.column.id,
    }),
    columnHelper.accessor('netMargin', {
        header: 'Net Margin',
        cell: info => formatPercent(info.getValue()),
        footer: info => info.column.id,
    }),
]

const queryClient = new QueryClient()

export default function Index() {
    return (
        <div className="flex h-screen">
            <div className="flex flex-col gap-8">
                <nav className="flex flex-col items-center justify-center gap-4 rounded-3xl border border-gray-200 p-6 dark:border-gray-700">
                    <p className="leading-6 text-gray-700">
                        Menu
                    </p>
                </nav>
                <header className="flex flex-col items-center gap-9">
                    <h1 className="leading text-2xl font-bold text-gray-800">
                        Lista das ações
                    </h1>
                </header>
                <div className="px-8 py-2 flex w-screen items-center justify-center">
                    <QueryClientProvider client={queryClient}>
                        <StockTable />
                    </QueryClientProvider>
                </div>
            </div>
        </div>
    );
}

const isLowerVisibilityCol = (cell: Cell<Stock, unknown>): boolean => cell.column.id === 'segment'
const isTextCol = (cell: Cell<Stock, unknown> | Header<Stock, unknown>): boolean => ['ticker', 'name', 'segment'].includes(cell.column.id)

function StockTable() {
    const [data, setData] = useState<Stock[]>([])

    const query = useQuery({
        queryKey: ['companiesData'],
        queryFn: async () => {
            const response = await fetch(
                'http://127.0.0.1:8000/api/companies',
            )
            return await response.json()
        },
    })

    useEffect(() => {
        setData(query.data)
    }, [query])

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    })

    const cssDivide = 'divide-y divide-gray-300'

    if (query.isPending) return <div className='font-normal text-gray-500'>Loading Data...</div>

    if (query.error) return <div className='font-normal text-red-500'>An error has occurred while loading data: {query.error.message}</div>

    return (
        <div className="overflow-hidden border border-gray-400 md:rounded-lg">
            <table className={cssDivide}>
                <thead>
                    {table.getHeaderGroups().map(headerGroup => (
                        <tr key={headerGroup.id}>
                            {headerGroup.headers.map(header => (
                                <th key={header.id} className={
                                    'px-4 py-3.5 text-xs font-normal text-gray-500' +
                                    (isTextCol(header) ? ' text-left' : ' text-right')
                                }>
                                    {header.isPlaceholder
                                        ? null
                                        : (flexRender(
                                            header.column.columnDef.header,
                                            header.getContext()
                                        ))}
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody className={cssDivide + ' bg-white'}>
                    {table.getRowModel() !== undefined ? table.getRowModel().rows.map(row => (
                        <tr key={row.id} className='hover:bg-gray-100'>
                            {row.getVisibleCells().map(cell => (
                                <td key={cell.id} className={
                                    'px-4 py-3 text-sm font-medium' +
                                    (isLowerVisibilityCol(cell) ? ' text-gray-400' : ' text-gray-700') +
                                    (isTextCol(cell) ? ' text-left' : ' text-right')}>
                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                </td>
                            )
                            )}
                        </tr>
                    )) : null}
                </tbody>
            </table>
        </div>
    )
}