import { useMemo } from 'react'

import type { ScaleLinear, ScaleTime } from 'd3'
import type { Margin } from './types'

interface Props {
    xScale: ScaleLinear<number, number> | ScaleTime<number, number>
    yScale: ScaleLinear<number, number>
    width: number
    height: number
    margin: Margin
    colour?: string
    fontSize?: string
    xFormatter?: (value: number | Date) => string
    yFormatter?: (value: number) => string
    xTicks?: number
    xTicksHideZero?: boolean
    yTicks?: number
    yTicksHideZero?: boolean
}

export default function Axes({
    xScale,
    yScale,
    width,
    height,
    margin,
    colour = 'currentColor',
    fontSize = '0.8rem',
    xFormatter,
    yFormatter,
    xTicks,
    xTicksHideZero,
    yTicks,
    yTicksHideZero,
}: Props) {
    return (
        <g>
            <AxisLeft
                scale={yScale}
                height={height}
                margin={margin}
                colour={colour}
                fontSize={fontSize}
                formatter={yFormatter}
                nTicks={yTicks}
                ticksHideZero={yTicksHideZero}
            />
            <AxisBottom
                scale={xScale}
                height={height}
                width={width}
                margin={margin}
                colour={colour}
                fontSize={fontSize}
                formatter={xFormatter}
                nTicks={xTicks}
                ticksHideZero={xTicksHideZero}
            />
        </g>
    )
}

type AxisBottomProps = {
    scale: ScaleLinear<number, number> | ScaleTime<number, number>
    height: number
    width: number
    margin: Margin
    colour: string
    fontSize: string
    formatter?: (value: number | Date) => string
    nTicks?: number
    ticksHideZero?: boolean
}

function AxisBottom({
    scale,
    height,
    width,
    margin,
    colour,
    fontSize,
    formatter,
    nTicks,
    ticksHideZero,
}: AxisBottomProps) {
    const tickTextSpacing = 20

    const ticks = useMemo(
        () => scale.ticks(nTicks).slice(ticksHideZero ? 1 : 0),
        [scale, nTicks, ticksHideZero]
    )

    return [
        <path
            className="axis-line x"
            key="x-axis-line"
            stroke={colour}
            fill="none"
            d={`M ${margin.left} ${height - margin.bottom} H ${width - margin.right}`}
        />,
        ticks.map((value, i) => (
            <g key={i} transform={`translate(${scale(value)}, 0)`}>
                <line
                    className="axis-tick-line x"
                    y1={height - margin.bottom}
                    y2={
                        height -
                        margin.bottom -
                        (margin.bottom - tickTextSpacing - 4)
                    }
                    stroke={colour}
                />
                <text
                    className="axis-text x"
                    y={height - margin.bottom + tickTextSpacing}
                    textAnchor="middle"
                    fontSize={fontSize}
                    fill={colour}
                >
                    {formatter
                        ? formatter(value)
                        : value instanceof Date
                          ? value.toLocaleDateString(undefined, {
                                year: 'numeric',
                                month: 'short',
                            })
                          : value}
                </text>
            </g>
        )),
    ]
}

type AxisLeftProps = {
    scale: ScaleLinear<number, number>
    height: number
    margin: Margin
    colour: string
    fontSize: string
    formatter?: (value: number) => string
    nTicks?: number
    ticksHideZero?: boolean
}

function AxisLeft({
    scale,
    height,
    margin,
    colour,
    fontSize,
    formatter,
    nTicks,
    ticksHideZero,
}: AxisLeftProps) {
    const tickTextSpacing = 8

    const ticks = useMemo(
        () => scale.ticks(nTicks).slice(ticksHideZero ? 1 : 0),
        [scale, nTicks, ticksHideZero]
    )

    return [
        <path
            className="axis-line y"
            key="y-axis-line"
            d={`M ${margin.left} 0 V ${height - margin.bottom}`}
            stroke={colour}
            fill="none"
        />,
        ticks.map((value, i) => (
            <g key={i} transform={`translate(${margin.left}, ${scale(value)})`}>
                <line
                    className="axis-tick-line y"
                    x1={-tickTextSpacing + 4}
                    stroke={colour}
                />
                <text
                    className="axis-text y"
                    x={-tickTextSpacing}
                    y={5}
                    textAnchor="end"
                    fontSize={fontSize}
                    fill={colour}
                >
                    {formatter ? formatter(value) : value}
                </text>
            </g>
        )),
    ]
}
