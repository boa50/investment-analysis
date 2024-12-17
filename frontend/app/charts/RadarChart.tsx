import * as d3 from 'd3'
import BaseChart from './BaseChart'
import RadarGrid from './RadarGrid'
import RadarTooltip from './tooltips/RadarTooltip'

import type { ScaleLinear } from 'd3'
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
    valueFormatter?: (value: number) => string
    valueColour?: string
    gridColour?: string
    gridType?: RadarGridType
    gridNumLevels?: number
    gridAxesLabels?: { [name: string]: string }
}

export default function RadarChart({
    width,
    widthPadding = 0,
    data,
    minMaxValues,
    margin = 24,
    innerRadius = 0,
    valueFormatter,
    valueColour = 'black',
    gridColour = 'red',
    gridType = 'straight',
    gridNumLevels = 4,
    gridAxesLabels = {},
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

    const radiusScales: { [name: string]: ScaleLinear<number, number, never> } =
        {}

    variableNames.forEach((variable) => {
        radiusScales[variable] = d3
            .scaleLinear()
            .domain(minMaxValuesCleaned[variable])
            .range([innerRadius, outerRadius])
    })

    const axisConfig = variableNames.map((variable) => {
        return { name: variable, max: minMaxValuesCleaned[variable][1] }
    })

    const dataCoordinates = axisConfig.map((axis) => {
        const radiusScale = radiusScales[axis.name]
        const angle = angleScale(axis.name)
        const radius = radiusScale(data[axis.name])
        const coordinate: [number, number] = [angle ?? 0, radius]
        return coordinate
    })
    dataCoordinates.push(dataCoordinates[0])

    const linePath = d3.lineRadial()(dataCoordinates)

    const pointsTransformTranslate =
        'translate(' + (width + widthPadding) / 2 + ',' + height / 2 + ')'

    return (
        <BaseChart width={width + widthPadding} height={height}>
            <g transform={pointsTransformTranslate}>
                <RadarGrid
                    innerRadius={innerRadius}
                    outerRadius={outerRadius}
                    angleScale={angleScale}
                    axisConfig={axisConfig}
                    type={gridType}
                    colour={gridColour}
                    nLevels={gridNumLevels}
                    axesLabels={gridAxesLabels}
                />
                <path
                    d={linePath ?? ''}
                    stroke={valueColour}
                    strokeWidth={1.5}
                    fill={valueColour}
                    fillOpacity={0.1}
                />
            </g>
            <RadarTooltip
                dataCoordinates={dataCoordinates}
                dataValues={Object.values(data)}
                chartWidth={width + widthPadding}
                chartHeight={height}
                pointsTransformTranslate={pointsTransformTranslate}
                valueFormatter={valueFormatter}
                contentFontSize="0.9rem"
            />
        </BaseChart>
    )
}
