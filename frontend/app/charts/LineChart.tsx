import { useState } from 'react'
import * as d3 from 'd3'
import Axes from './Axes'
import { getLeftMargin } from './utils'
import Tooltip from './Tooltip'

import type { Margin, InteractionData } from './types'

interface LineChartProps {
    width: number
    height: number
    data: { x: number | Date; y: number }[]
    margin?: Margin
    yFormatter?: (value: number) => string
    lineColour?: string
    axesColour?: string
    zeroLineColour?: string
}

export const LineChart = ({
    width,
    height,
    data,
    margin = { left: 24, right: 16, top: 16, bottom: 20 },
    yFormatter,
    lineColour = 'currentColor',
    axesColour = 'currentColor',
    zeroLineColour,
}: LineChartProps) => {
    const [interactionData, setInteractiondata] =
        useState<InteractionData | null>(null)

    const paddingMultiplier = 1.07
    const yScale = d3
        .scaleLinear()
        .domain([
            Math.min((d3.min(data, (d) => d.y) ?? 0) * paddingMultiplier, 0),
            (d3.max(data, (d) => d.y) ?? 0) * paddingMultiplier,
        ])
        .range([height - margin.bottom, margin.top])

    const axisFontSize = '0.8rem'
    margin.left = getLeftMargin({
        value: yScale.ticks().slice(-1)[0],
        defaultMargin: margin.left,
        formatter: yFormatter,
        tickTextSpacing: 8,
        fontSize: axisFontSize,
    })

    let xScale
    const [xMin = 0, xMax = 0] = d3.extent(data, (d) => d.x)

    // Typescript is giving me some problems when I try to decouple the scale function from the rest of the attributes
    if (data[0].x instanceof Date) {
        xScale = d3
            .scaleTime()
            .domain([xMin, xMax])
            .range([margin.left, width - margin.right])
    } else {
        xScale = d3
            .scaleLinear()
            .domain([xMin, xMax])
            .range([margin.left, width - margin.right])
    }

    const lineBuilder = d3
        .line<{ x: number | Date; y: number }>()
        .x((d) => xScale(d.x))
        .y((d) => yScale(d.y))

    const linePath = lineBuilder(data)

    const tooltips = data.map((d, i) => {
        return (
            <g
                key={i}
                onMouseEnter={() =>
                    setInteractiondata({
                        xPos: xScale(d.x),
                        yPos: yScale(d.y),
                        label: yFormatter !== undefined ? yFormatter(d.y) : '',
                        content:
                            d.x instanceof Date
                                ? d3.timeFormat('Trim %q %Y')(d.x)
                                : d.x.toLocaleString(),
                    })
                }
                onMouseLeave={() => setInteractiondata(null)}
            >
                <circle
                    cx={xScale(d.x)}
                    cy={yScale(d.y)}
                    r={5}
                    className={'circle primary opacity-0 hover:opacity-100'}
                />
            </g>
        )
    })

    return (
        <div style={{ position: 'relative', width: '100%', height: '100%' }}>
            <svg
                viewBox={`0 0 ${width} ${height}`}
                preserveAspectRatio="xMinYMid meet"
            >
                {yScale.domain()[0] < 0 ? (
                    <path
                        className="zero-line"
                        d={`M ${margin.left} ${yScale(0)} H ${width - margin.right}`}
                        stroke={zeroLineColour ? zeroLineColour : axesColour}
                        fill="none"
                    />
                ) : null}
                <path
                    d={linePath ?? ''}
                    stroke={lineColour}
                    fill="none"
                    strokeWidth={2}
                />
                {tooltips}
                <Axes
                    xScale={xScale}
                    yScale={yScale}
                    width={width}
                    height={height}
                    margin={margin}
                    colour={axesColour}
                    yFormatter={yFormatter}
                />
                <Tooltip interactionData={interactionData} chartWidth={width} />
            </svg>
        </div>
    )
}
