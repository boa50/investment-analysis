import React from 'react'
import { Link, useLocation, Location } from '@remix-run/react'
import SearchBar from './SearchBar'

const navLinkDefaultClass = 'flex transition-colors duration-300'

const isCurrentLocation = (pathname: string, location: Location): boolean =>
    pathname === location.pathname
const getNavLinkClass = (pathname: string, location: Location): string =>
    navLinkDefaultClass +
    (isCurrentLocation(pathname, location)
        ? ' font-semibold text-appAccent cursor-default'
        : ' text-appTextNormal hover:text-appAccent cursor-pointer')
const getNavLinkOnClick = (
    e: React.MouseEvent,
    pathname: string,
    location: Location
): React.MouseEvent | void =>
    isCurrentLocation(pathname, location) ? e.preventDefault() : e

export default function Header() {
    const location = useLocation()

    const getLink = (destination: string, description: string) => (
        <Link
            to={destination}
            onClick={(e) => getNavLinkOnClick(e, destination, location)}
            className={getNavLinkClass(destination, location)}
        >
            {description}
        </Link>
    )

    return (
        <div className="bg-appBackground w-full sticky top-0 left-0 right-0 z-10 shadow-md">
            <div className="relative container flex justify-between py-2">
                <div className="flex items-center">
                    <Link className="cursor-pointer" to="/">
                        <img
                            className="h-10 object-cover"
                            src="/logo.webp"
                            alt="App Logo"
                        />
                    </Link>
                </div>

                <div className="absolute inset-y-0 left-1/2 transform -translate-x-1/2 flex items-center">
                    <nav className="items-center hidden space-x-8 lg:flex">
                        {getLink('/', 'Início')}
                        {getLink('/stocks', 'Lista de Ações')}
                        {getLink('/stocks-compare', 'Comparador de Ações')}
                    </nav>
                </div>

                <SearchBar />
            </div>
        </div>
    )
}
