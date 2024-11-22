import { Link } from '@remix-run/react'
import RatingStars from './RatingStars'

export default function SearchBar() {
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
                    placeholder="Busque um ativo.."
                    aria-label="Search components"
                    id="headlessui-combobox-input-:r5n:"
                    role="combobox"
                    type="text"
                    aria-controls=""
                    aria-expanded="false"
                    aria-autocomplete="list"
                    style={{ caretColor: 'rgb(107, 114, 128)' }}
                />
            </div>
            <div className="absolute top-full bg-gray-50 border rounded-md">
                <ul className="divide-y divide-gray-300">
                    <li className="hover:bg-gray-100 px-6 first:pt-4 last:pb-4 py-2">
                        <StockBasicInfo
                            ticker="BBAS3"
                            name="Banco do Brasil S.A."
                            segment="Bancos"
                        />
                    </li>
                    <li className="hover:bg-gray-100 px-6 first:pt-4 last:pb-4 py-2">
                        <StockBasicInfo
                            ticker="BBAS3"
                            name="Banco do Brasil S.A."
                            segment="Bancos"
                        />
                    </li>
                </ul>
            </div>
        </div>
    )
}

interface StockBasicInfoProps {
    ticker: string
    name: string
    segment: string
}

function StockBasicInfo({ ticker, name, segment }: StockBasicInfoProps) {
    return (
        <Link to={'/stock/' + ticker}>
            <div className="flex flex-row space-x-4">
                <div className="flex items-center">
                    <img
                        src="https://picsum.photos/seed/picsum/200"
                        alt=""
                        className="rounded-full h-12 object-cover"
                    />
                </div>
                <div className="flex flex-col">
                    <div className="flex flex-row space-x-1 items-center">
                        <h1 className="tracking-wide text-base font-semibold text-gray-800">
                            {ticker}
                        </h1>
                        <RatingStars rating={3} size="small" />
                    </div>
                    <span className="text-sm font-normal text-gray-800">
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
