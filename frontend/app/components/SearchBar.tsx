import { useQuery } from '@tanstack/react-query'
import { searchCompanies } from '../api/stocks'
import { useState, useEffect } from 'react'
import { Link } from '@remix-run/react'
import RatingStars from './RatingStars'

import type { ChangeEvent, MouseEvent } from 'react'
import type { CompanySearch } from '../types/stocks'

export default function SearchBar() {
    const [showPopover, setShowPopover] = useState(false)
    const [searchText, setSearchText] = useState('')

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
    }

    useEffect(() => {
        if (searchText.length >= 2) {
            setShowPopover(true)
        } else {
            setShowPopover(false)
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
    rating: number
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
            onMouseDown={(e) => e.preventDefault()}
            onClick={onClick}
        >
            <div className="flex flex-row space-x-4">
                <div className="flex items-center">
                    <img
                        src="https://picsum.photos/seed/picsum/200"
                        alt=""
                        className="rounded-full w-12 object-cover"
                    />
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
    listClickHandler: (e: MouseEvent<HTMLAnchorElement>) => void
}

function Stocks({ searchText, listClickHandler }: StocksProps) {
    const [stocks, setStocks] = useState<CompanySearch[]>([])
    const [queryKey, setQueryKey] = useState('')

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
        if (query.data !== null && query.data !== undefined) {
            setStocks(query.data)
        }
    }, [query.data])

    if (query.isPending || searchText !== queryKey)
        return (
            <div className="flex justify-center py-6 w-[23rem]">
                <StockPlaceholder />
            </div>
        )

    if (
        !query.isPending &&
        stocks.length == 0 &&
        queryKey.length >= 2 &&
        searchText === queryKey
    )
        return (
            <div className="flex justify-center items-center py-6 w-[23rem] h-24">
                <span className="text-appTextWeak text-sm">
                    Não foram encontrados resultados pra a busca
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
                        rating={d.rating}
                        onClick={listClickHandler}
                    />
                </li>
            ))}
        </ul>
    )
}

function StockPlaceholder() {
    return (
        <div className="animate-pulse flex space-x-4 mb-2">
            <div className="flex items-center">
                <div className="rounded-full bg-slate-700 h-12 w-12"></div>
            </div>
            <div className="flex flex-col w-64 space-y-2">
                <div className="grid grid-cols-8 gap-2 items-center">
                    <div className="h-3 bg-slate-700 rounded col-span-2"></div>
                    <div className="h-2 bg-slate-700 rounded col-span-2"></div>
                </div>
                <div className="h-3 bg-slate-700 rounded"></div>
                <div className="grid grid-cols-2 gap-2 items-center">
                    <div className="h-3 bg-slate-700 rounded"></div>
                </div>
            </div>
        </div>
    )
}
