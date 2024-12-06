import { useState, useEffect } from 'react'

const formatDecimal = (num: number): string =>
    Intl.NumberFormat('pt-BR', {
        maximumFractionDigits: 2,
    }).format(num)
const formatCurrency = (num: number, decimals: boolean = false): string =>
    new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        notation: 'compact',
        maximumFractionDigits: decimals ? 2 : 0,
    }).format(num)
const formatPercent = (num: number): string =>
    Intl.NumberFormat('pt-BR', {
        style: 'percent',
        maximumFractionDigits: 2,
    }).format(num)

export const formatNum = (
    num: number | undefined,
    formatType: 'decimal' | 'currency' | 'currencyDecimal' | 'percent'
): string => {
    if (num === undefined) return '-'

    switch (formatType) {
        case 'decimal':
            return formatDecimal(num)
        case 'currency':
            return formatCurrency(num)
        case 'currencyDecimal':
            return formatCurrency(num, true)
        case 'percent':
            return formatPercent(num)
        default:
            return num.toString()
    }
}

const useMediaQuery = (query: string): boolean => {
    const [matches, setMatches] = useState<boolean>(false)

    useEffect(() => {
        const media = window.matchMedia(query)
        if (media.matches !== matches) {
            setMatches(media.matches)
        }

        const listener = () => setMatches(media.matches)

        media.addEventListener('change', listener)

        return () => media.removeEventListener('change', listener)
    }, [matches, query])

    return matches
}

export const useMediaQueries = () => {
    const xl2 = useMediaQuery('(min-width: 1536px)')
    const xl = useMediaQuery('(min-width: 1280px)')
    const lg = useMediaQuery('(min-width: 1024px)')
    const md = useMediaQuery('(min-width: 768px)')

    return { xl2, xl, lg, md }
}
