import * as d3 from 'd3'
import BaseChart from './BaseChart'
import RadarGrid from './RadarGrid'
import RadarTooltip from './tooltips/RadarTooltip'

import type { JSX } from 'react'
import type { ScaleLinear } from 'd3'
import type {
    RadarGridType,
    RadarDatapoint,
    RadarVariableMinMaxValues,
} from './types'

interface Props {
    width: number
    height?: number
    widthPadding?: number
    data: RadarDatapoint[]
    minMaxValues?: RadarVariableMinMaxValues | undefined
    margin?: number
    innerRadius?: number
    valueFormatter?: (value: number) => string
    valueColours?: string[]
    gridColour?: string
    gridType?: RadarGridType
    gridNumLevels?: number
    gridAxesLabels?: { [name: string]: string }
    showTooltips?: boolean
    highlightedIndex?: number
    highlightColour?: string
}

export default function RadarChart({
    width,
    height = 1e10,
    widthPadding = 0,
    data,
    minMaxValues,
    margin = 24,
    innerRadius = 0,
    valueFormatter,
    valueColours = ['black'],
    gridColour = 'grey',
    gridType = 'straight',
    gridNumLevels = 4,
    gridAxesLabels = {},
    showTooltips = true,
    highlightedIndex,
    highlightColour = 'black',
}: Props) {
    const side = Math.min(width, height)
    const outerRadius = side / 2 - margin
    const variableNames = Object.keys(data[0])

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

    const allDataCoordinates: [number, number][] = []
    const allDataValues: number[] = []
    const paths: JSX.Element[] = []

    const getDataCoordinates = (dataPoint: RadarDatapoint) =>
        axisConfig.map((axis) => {
            const radiusScale = radiusScales[axis.name]
            const angle = angleScale(axis.name)
            const radius = radiusScale(dataPoint[axis.name])

            allDataValues.push(radius)

            const coordinate: [number, number] = [angle ?? 0, radius]
            return coordinate
        })

    const dataSorted = [...data]
    if (highlightedIndex !== undefined)
        dataSorted.splice(
            dataSorted.length - 1,
            0,
            dataSorted.splice(highlightedIndex, 1)[0]
        )

    dataSorted.forEach((dataPoint, i) => {
        const dataCoordinates = getDataCoordinates(dataPoint)
        allDataCoordinates.push(...dataCoordinates)

        dataCoordinates.push(dataCoordinates[0])

        const linePath = d3.lineRadial()(dataCoordinates)

        let lineColour = 'black'
        if (highlightedIndex !== undefined && i === dataSorted.length - 1)
            lineColour = highlightColour
        else lineColour = valueColours[i % valueColours.length]

        paths.push(
            <path
                key={i}
                d={linePath ?? ''}
                stroke={lineColour}
                strokeWidth={1.5}
                fill={lineColour}
                fillOpacity={0.25}
            />
        )
    })

    const dataCoordinates = getDataCoordinates(data[0])
    dataCoordinates.push(dataCoordinates[0])

    const pointsTransformTranslate =
        'translate(' + (side + widthPadding) / 2 + ',' + side / 2 + ')'

    return (
        <BaseChart width={side + widthPadding} height={side}>
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
                {paths}
            </g>
            {showTooltips ? (
                <RadarTooltip
                    dataCoordinates={allDataCoordinates}
                    dataValues={allDataValues}
                    chartWidth={side + widthPadding}
                    chartHeight={side}
                    circleColours={valueColours}
                    nVariables={variableNames.length}
                    pointsTransformTranslate={pointsTransformTranslate}
                    valueFormatter={valueFormatter}
                    contentFontSize="0.9rem"
                />
            ) : null}
        </BaseChart>
    )
}
