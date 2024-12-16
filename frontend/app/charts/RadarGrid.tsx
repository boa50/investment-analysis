import * as d3 from 'd3'
import { polarToCartesian, getTextWidth } from './utils'

import type { RadarGridAxisConfig, RadarGridType } from './types'

interface Props {
    axisConfig: RadarGridAxisConfig[]
    angleScale: d3.ScaleBand<string>
    outerRadius: number
    innerRadius?: number
    nLevels?: number
    colour?: string
    type?: RadarGridType
    strokeWidth?: number
}

export const RadarGrid = ({
    axisConfig,
    angleScale,
    outerRadius,
    innerRadius = 0,
    nLevels = 4,
    colour = 'grey',
    type = 'straight',
    strokeWidth = 0.75,
}: Props) => {
    const axes = axisConfig.map((axis, i) => {
        const angle = angleScale(axis.name)

        if (angle === undefined) {
            return null
        }

        const path = d3.lineRadial()([
            [angle, innerRadius],
            [angle, outerRadius],
        ])

        const labelPosition = polarToCartesian(
            angle - Math.PI / 2,
            outerRadius + 7
        )

        const halfLabelWidth = getTextWidth(axis.name, '0.8rem', '400') / 2

        return (
            <g key={i}>
                <path
                    d={path ?? ''}
                    stroke={colour}
                    opacity={0.25}
                    strokeWidth={strokeWidth}
                    rx={1}
                />
                <text
                    x={labelPosition.x}
                    y={labelPosition.y}
                    dx={
                        Math.abs(labelPosition.x) > 1
                            ? -halfLabelWidth / labelPosition.x
                            : -halfLabelWidth
                    }
                    fontSize={'0.8rem'}
                    fontWeight={400}
                    fill={colour}
                    textAnchor={labelPosition.x > 0 ? 'start' : 'end'}
                    dominantBaseline="middle"
                >
                    {axis.name}
                </text>
            </g>
        )
    })

    const getLevelRadius = (level: number) =>
        innerRadius + (level * (outerRadius - innerRadius)) / (nLevels - 1)

    const gridLevels =
        type === 'straight'
            ? getStraightLevels(
                  axisConfig.map((axis) => angleScale(axis.name)),
                  nLevels,
                  getLevelRadius,
                  colour,
                  strokeWidth
              )
            : getCircleLevels(nLevels, getLevelRadius, colour, strokeWidth)

    return (
        <g>
            {axes}
            {gridLevels}
        </g>
    )
}

function getStraightLevelPath(
    allAngles: (number | undefined)[],
    radius: number
) {
    return allAngles
        .reduce((accumulator, currentAngle, index) => {
            const nextIndex = index < allAngles.length - 1 ? index + 1 : 0

            return (
                accumulator +
                d3.lineRadial()([
                    [currentAngle ?? 0, radius],
                    [allAngles[nextIndex] ?? 0, radius],
                ])
            )
        }, '')
        ?.toString()
}

function getStraightLevels(
    allAngles: (number | undefined)[],
    nLevels: number,
    getLevelRadius: (level: number) => number,
    colour: string = 'grey',
    strokeWidth: number
) {
    return [...Array(nLevels).keys()].map((level) => {
        const levelRadius = getLevelRadius(level)
        const path = getStraightLevelPath(allAngles, levelRadius)

        return (
            <path
                key={level}
                d={path}
                stroke={colour}
                strokeWidth={strokeWidth}
                rx={1}
                opacity={level !== nLevels - 1 ? 0.25 : 1}
            />
        )
    })
}

function getCircleLevels(
    nLevels: number,
    getLevelRadius: (level: number) => number,
    colour: string = 'grey',
    strokeWidth: number
) {
    return [...Array(nLevels).keys()].map((level) => {
        const levelRadius = getLevelRadius(level)

        return (
            <circle
                key={level}
                cx={0}
                cy={0}
                r={levelRadius}
                stroke={colour}
                strokeWidth={strokeWidth}
                fill="none"
                opacity={level !== nLevels - 1 ? 0.25 : 1}
            />
        )
    })
}
