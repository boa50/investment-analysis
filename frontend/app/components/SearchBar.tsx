import { useState, useEffect } from 'react'
import { useQuery, useQueries } from '@tanstack/react-query'
import { getStockRatings, searchCompanies } from '../api/stocks'
import { Link } from '@remix-run/react'
import RatingStars from './RatingStars'
import Placeholder from './Placeholder'
import StockImg from './StockImg'

import type { ChangeEvent, MouseEvent } from 'react'
import type { CompanySearch } from '../types'

export default function SearchBar() {
    const [showPopover, setShowPopover] = useState(false)
    const [searchText, setSearchText] = useState('')
    const [stocks, setStocks] = useState<CompanySearch[]>([])

    const searchHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setSearchText(e.target.value)
    }

    const focusHandler = () => {
        if (searchText.length >= 2) {
            setShowPopover(true)
        }
    }

    const blurHandler = () => {
        setShowPopover(false)
    }

    const listClickHandler = (e: MouseEvent<HTMLAnchorElement>) => {
        setShowPopover(false)
        e.currentTarget.focus()
        e.currentTarget.blur()
        setSearchText('')
        setStocks([])
    }

    useEffect(() => {
        if (searchText.length >= 2) {
            setShowPopover(true)
        } else {
            setShowPopover(false)
            setStocks([])
        }
    }, [searchText])

    return (
        <div className="flex flex-col items-center">
            <div
                className="flex items-center px-3.5 py-2 text-gray-400 group hover:ring-1 
                            hover:ring-gray-300 focus-within:!ring-2 ring-inset focus-within:!ring-appAccent 
                            rounded-md"
            >
                <svg
                    className="mr-2 h-5 w-5 stroke-slate-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="2"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    ></path>
                </svg>
                <input
                    className="block appearance-none bg-transparent text-base 
                                text-gray-700 placeholder:text-gray-400 focus:outline-none 
                                sm:text-sm sm:leading-6"
                    placeholder="Busque um ativo..."
                    aria-label="Search components"
                    id="search-box"
                    role="combobox"
                    type="text"
                    aria-controls=""
                    aria-expanded="false"
                    aria-autocomplete="list"
                    onChange={searchHandler}
                    value={searchText}
                    onFocus={focusHandler}
                    onBlur={blurHandler}
                    style={{ caretColor: 'rgb(107, 114, 128)' }}
                />
            </div>
            <div
                className={
                    'absolute top-full bg-appBackground border rounded-md ' +
                    (showPopover ? 'block' : 'hidden')
                }
            >
                <Stocks
                    searchText={searchText}
                    stocks={stocks}
                    updateStocksHandler={setStocks}
                    listClickHandler={listClickHandler}
                />
            </div>
        </div>
    )
}

interface StockBasicInfoProps {
    ticker: string
    name: string
    segment: string
    rating: number | undefined
    onClick?: (e: MouseEvent<HTMLAnchorElement>) => void
}

function StockBasicInfo({
    ticker,
    name,
    segment,
    rating,
    onClick,
}: StockBasicInfoProps) {
    return (
        <Link
            to={'/stock/' + ticker}
            prefetch="intent"
            onMouseDown={(e) => e.preventDefault()}
            onClick={onClick}
        >
            <div className="flex flex-row space-x-4">
                <div className="flex items-center">
                    <StockImg size="small" />
                </div>
                <div className="flex flex-col w-64">
                    <div className="flex flex-row space-x-1 items-center">
                        <h1 className="tracking-wide text-base font-semibold text-appTextStrong">
                            {ticker}
                        </h1>
                        <RatingStars rating={rating} size="small" />
                    </div>
                    <span className="text-sm font-normal text-appTextStrong truncate">
                        {name}
                    </span>
                    <span className="text-sm font-normal text-appTextWeak">
                        {segment}
                    </span>
                </div>
            </div>
        </Link>
    )
}

interface StocksProps {
    searchText: string
    stocks: CompanySearch[]
    updateStocksHandler: (stocks: CompanySearch[]) => void
    listClickHandler: (e: MouseEvent<HTMLAnchorElement>) => void
}

function Stocks({
    searchText,
    stocks,
    updateStocksHandler,
    listClickHandler,
}: StocksProps) {
    const [queryKey, setQueryKey] = useState('')
    const [queryRatingsTickers, setQueryRatingsTickers] = useState<string[]>([])

    useEffect(() => {
        const changeQueryKey = setTimeout(() => {
            setQueryKey(searchText)
        }, 500)

        return () => clearTimeout(changeQueryKey)
    }, [searchText])

    const query = useQuery({
        queryKey: ['searchCompany', queryKey],
        queryFn: () =>
            queryKey.length >= 2 ? searchCompanies(queryKey) : null,
    })

    useEffect(() => {
        const stocksTmp = query.data
        if (stocksTmp !== null && stocksTmp !== undefined) {
            updateStocksHandler(stocksTmp)
            setQueryRatingsTickers(stocksTmp.map((d) => d.ticker))
        }
    }, [query.data, updateStocksHandler])

    const queriesRatings = useQueries({
        queries: queryRatingsTickers.map((ticker) => {
            return {
                queryKey: ['stockRating', { ticker }],
                queryFn: () => getStockRatings(ticker),
            }
        }),
    })

    if (query.isPending || searchText !== queryKey)
        return <Placeholder type="stockSearch" />

    if (
        !query.isPending &&
        stocks.length == 0 &&
        queryKey.length >= 2 &&
        searchText === queryKey
    )
        return (
            <div className="flex justify-center items-center py-6 w-[23rem] h-24">
                <span className="text-appTextWeak text-sm">
                    Não foram encontrados resultados para a busca
                </span>
            </div>
        )

    return (
        <ul className="divide-y divide-appRowDivider max-h-[21rem] overflow-y-hidden overflow-y-scroll">
            {stocks.map((d, i) => (
                <li
                    key={i}
                    className="hover:bg-gray-200 px-6 first:pt-4 last:pb-4 py-2"
                >
                    <StockBasicInfo
                        ticker={d.ticker}
                        name={d.name}
                        segment={d.segment}
                        rating={queriesRatings[i].data?.overall}
                        onClick={listClickHandler}
                    />
                </li>
            ))}
        </ul>
    )
}
