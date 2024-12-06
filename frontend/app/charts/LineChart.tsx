import * as d3 from 'd3'
import Axes from './Axes'

import type { Margin } from './types'

type LineChartProps = {
    width: number
    height: number
    datas?: { x: number; y: number }[]
    margin?: Margin
}

export const LineChart = ({
    width,
    height,
    datas,
    margin = { left: 64, right: 16, top: 16, bottom: 20 },
}: LineChartProps) => {
    const data = [
        { x: 1, y: 90 },
        { x: 2, y: 12 },
        { x: 3, y: 34 },
        { x: 4, y: 53 },
        { x: 5, y: 98 },
    ]

    const xScale = d3
        .scaleLinear()
        .domain(d3.extent(data, (d) => d.x))
        .range([margin.left, width - margin.right])

    const yScale = d3
        .scaleLinear()
        .domain([0, d3.max(data, (d) => d.y)])
        .range([height - margin.bottom, margin.top])

    const lineBuilder = d3
        .line()
        .x((d) => xScale(d.x))
        .y((d) => yScale(d.y))

    const linePath = lineBuilder(data)

    return (
        <svg
            viewBox={`0 0 ${width} ${height}`}
            preserveAspectRatio="xMinYMid meet"
        >
            <path d={linePath} stroke="#9a6fb0" fill="none" strokeWidth={2} />
            <Axes
                xScale={xScale}
                yScale={yScale}
                width={width}
                height={height}
                margin={margin}
            />
        </svg>
    )
}
