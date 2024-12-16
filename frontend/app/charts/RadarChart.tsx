import * as d3 from 'd3'
import BaseChart from './BaseChart'
import { RadarGrid } from './RadarGrid'

import type { ScaleRadial } from 'd3'
import type {
    RadarGridType,
    RadarDatapoint,
    RadarVariableMinMaxValues,
} from './types'

interface Props {
    width: number
    widthPadding?: number
    data: RadarDatapoint
    minMaxValues?: RadarVariableMinMaxValues | undefined
    margin?: number
    innerRadius?: number
    valueColour?: string
    gridColour?: string
    gridType?: RadarGridType
    gridNumLevels?: number
}

export default function RadarChart({
    width,
    widthPadding = 0,
    data,
    minMaxValues,
    margin = 24,
    innerRadius = 0,
    valueColour = 'black',
    gridColour = 'red',
    gridType = 'straight',
    gridNumLevels = 4,
}: Props) {
    const height = width
    const outerRadius = width / 2 - margin
    const variableNames = Object.keys(data)

    let minMaxValuesCleaned: RadarVariableMinMaxValues = {}
    if (minMaxValues === undefined) {
        variableNames.forEach((variable) => {
            minMaxValuesCleaned[variable] = [0, 100]
        })
    } else {
        minMaxValuesCleaned = { ...minMaxValues }
    }

    const angleScale = d3
        .scaleBand()
        .domain(variableNames)
        .range([0, 2 * Math.PI])

    const radiusScales: { [name: string]: ScaleRadial<number, number, never> } =
        {}

    variableNames.forEach((variable) => {
        radiusScales[variable] = d3
            .scaleRadial()
            .domain(minMaxValuesCleaned[variable])
            .range([innerRadius, outerRadius])
    })

    const axisConfig = variableNames.map((variable) => {
        return { name: variable, max: minMaxValuesCleaned[variable][1] }
    })

    const radarCoordinates = axisConfig.map((axis) => {
        const radiusScale = radiusScales[axis.name]
        const angle = angleScale(axis.name)
        const radius = radiusScale(data[axis.name])
        const coordinate: [number, number] = [angle ?? 0, radius]
        return coordinate
    })
    radarCoordinates.push(radarCoordinates[0])

    const linePath = d3.lineRadial()(radarCoordinates)

    return (
        <BaseChart width={width + widthPadding} height={height}>
            <g
                transform={
                    'translate(' +
                    (width + widthPadding) / 2 +
                    ',' +
                    height / 2 +
                    ')'
                }
            >
                <RadarGrid
                    innerRadius={innerRadius}
                    outerRadius={outerRadius}
                    angleScale={angleScale}
                    axisConfig={axisConfig}
                    type={gridType}
                    colour={gridColour}
                    nLevels={gridNumLevels}
                />
                <path
                    d={linePath ?? ''}
                    stroke={valueColour}
                    strokeWidth={1.5}
                    fill={valueColour}
                    fillOpacity={0.1}
                />
            </g>
        </BaseChart>
    )
}
