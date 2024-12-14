import * as d3 from 'd3'
import BaseChart from './BaseChart'
import { RadarGrid } from './RadarGrid'

import type { Margin } from './types'

type DataItem = {
    [variable: string]: number
} & { name: string }

interface Props {
    width: number
    height: number
    data?: { [key: string]: number }
    margin?: number
}

export default function RadarChart({
    width,
    height,
    datas,
    margin = 24,
}: Props) {
    const data: { [key: string]: number } = {
        a: 100,
        b: 75,
        c: 82,
        d: 24,
        e: 10,
    }

    const outerRadius = Math.min(width, height) / 2 - margin
    const INNER_RADIUS = 40

    const allVariableNames = Object.keys(data)

    const angleScale = d3
        .scaleBand()
        .domain(allVariableNames)
        .range([0, 2 * Math.PI])

    // const valueScales: { [name: string]: YScale } = {}
    const valueScales = {}

    allVariableNames.forEach((key) => {
        valueScales[key] = d3
            .scaleRadial()
            .domain([0, 100])
            .range([INNER_RADIUS, outerRadius])
    })

    const axisConfig = allVariableNames.map((key) => {
        return { name: key, max: 100 }
    })

    return (
        <BaseChart width={width} height={height}>
            <g transform={'translate(' + width / 2 + ',' + height / 2 + ')'}>
                <RadarGrid
                    outerRadius={outerRadius}
                    angleScale={angleScale}
                    axisConfig={axisConfig}
                    type="straight"
                />
            </g>
        </BaseChart>
    )
}
