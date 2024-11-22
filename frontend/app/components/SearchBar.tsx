import { useState, useEffect } from 'react'
import { Link } from '@remix-run/react'
import RatingStars from './RatingStars'

import type { ChangeEvent, MouseEvent } from 'react'
import type { StockSearch } from '../types/stocks'

function searchStocks(text: string): StockSearch[] {
    return [
        {
            ticker: 'BBAS3',
            name: 'Banco do Brasil S.A.',
            segment: 'Bancos',
        },
        {
            ticker: 'ITUB4',
            name: 'Banco Itaú S.A.',
            segment: 'Bancos',
        },
        {
            ticker: 'CMIG4',
            name: 'CEMIG',
            segment: 'Energia Elétrica',
        },
        {
            ticker: 'AMBP3',
            name: 'AMBIPAR PARTICIPAÇÕES E EMPREENDIMENTOS S.A.',
            segment: 'Água e Saneamento',
        },
        {
            ticker: 'AGRO3',
            name: 'BRASILAGRO CIA BRAS DE PROP AGRICOLAS',
            segment: 'Agricultura',
        },
    ]
}

export default function SearchBar() {
    const [showPopover, setShowPopover] = useState(false)
    const [searchText, setSearchText] = useState('')
    const [stocks, setStocks] = useState<StockSearch[]>([])

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
            const searchReturn = searchStocks(searchText.toLowerCase())
            setStocks(searchReturn)
            setShowPopover(true)
        } else {
            setShowPopover(false)
        }
    }, [searchText])

    return (
        <div className="flex flex-col items-center">
            <div
                className="flex items-center px-3.5 py-2 text-gray-400 group hover:ring-1 
                            hover:ring-gray-300 focus-within:!ring-2 ring-inset focus-within:!ring-blue-500 
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
                    'absolute top-full bg-gray-50 border rounded-md ' +
                    (showPopover ? 'block' : 'hidden')
                }
            >
                <ul className="divide-y divide-gray-300 max-h-[21rem] overflow-y-hidden overflow-y-scroll">
                    {stocks.map((d, i) => (
                        <li
                            key={i}
                            className="hover:bg-gray-100 px-6 first:pt-4 last:pb-4 py-2"
                        >
                            <StockBasicInfo
                                ticker={d.ticker}
                                name={d.name}
                                segment={d.segment}
                                onClick={listClickHandler}
                            />
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    )
}

interface StockBasicInfoProps {
    ticker: string
    name: string
    segment: string
    onClick?: (e: MouseEvent<HTMLAnchorElement>) => void
}

function StockBasicInfo({
    ticker,
    name,
    segment,
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
                        <h1 className="tracking-wide text-base font-semibold text-gray-800">
                            {ticker}
                        </h1>
                        <RatingStars rating={3} size="small" />
                    </div>
                    <span className="text-sm font-normal text-gray-800 truncate">
                        {name}
                    </span>
                    <span className="text-sm font-normal text-gray-400">
                        {segment}
                    </span>
                </div>
            </div>
        </Link>
    )
}
