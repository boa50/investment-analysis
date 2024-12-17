import * as d3 from 'd3'
import { useState, useEffect, useLayoutEffect, useCallback } from 'react'

import type { ScaleLinear, ScaleTime } from 'd3'

export const getTextWidth = (
    txt: string,
    fontSize = '1rem',
    fontWeight = '700'
) => {
    const text = document.createElement('span')
    document.body.appendChild(text)

    text.style.font = 'ui-sans-serif'
    text.style.fontSize = fontSize
    text.style.fontWeight = fontWeight
    text.style.height = 'auto'
    text.style.width = 'auto'
    text.style.position = 'absolute'
    text.style.whiteSpace = 'no-wrap'
    text.innerHTML = txt

    const width = Math.ceil(text.clientWidth)
    document.body.removeChild(text)

    return width
}

interface getLeftMarginProps {
    value: number
    defaultMargin?: number
    formatter?: (value: number) => string
    fontSize?: string
    fontWeight?: string
    tickTextSpacing?: number
}

export const getLeftMargin = ({
    value,
    defaultMargin,
    formatter,
    fontSize = '0.8rem',
    fontWeight = '500',
    tickTextSpacing = 0,
}: getLeftMarginProps) => {
    const maxText = formatter ? formatter(value) : value.toString()
    const textMargin =
        getTextWidth(maxText, fontSize, fontWeight) + tickTextSpacing

    if (defaultMargin === undefined) {
        return textMargin + 2
    } else {
        return textMargin > defaultMargin ? textMargin + 2 : defaultMargin
    }
}

export const getHoveredDataPoint = (
    event: React.MouseEvent<SVGRectElement, MouseEvent>,
    data: { x: number | Date; y: number }[],
    xScale: ScaleLinear<number, number> | ScaleTime<number, number>
): [{ x: number | Date; y: number }, number] => {
    const x_val = xScale.invert(d3.pointer(event)[0])
    const idx = d3
        .bisector((d: { x: number | Date; y: number }) => d.x)
        .center(data, x_val)

    return [data[idx], idx]
}

export const polarToCartesian = (angle: number, distance: number) => {
    const x = distance * Math.cos(angle)
    const y = distance * Math.sin(angle)
    return { x, y }
}

export const useDimensions = (targetDiv: HTMLDivElement | null) => {
    const getDimensions = useCallback(() => {
        const dims = {
            width: targetDiv?.offsetWidth ?? 0,
            height: targetDiv?.offsetHeight ?? 0,
        }

        // Multiplied by 0.99 to prevent exploding the chart container when resizing
        dims.height *= 0.99

        return dims
    }, [targetDiv])

    const [dimensions, setDimensions] = useState(getDimensions)

    const handleResize = useCallback(() => {
        setDimensions(getDimensions())
    }, [getDimensions])

    useEffect(() => {
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [handleResize])

    useLayoutEffect(() => {
        handleResize()
    }, [handleResize])

    return dimensions
}
