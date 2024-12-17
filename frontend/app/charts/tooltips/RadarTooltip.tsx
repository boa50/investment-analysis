import { useState } from 'react'
import { polarToCartesian } from '../utils'
import Display from './Display'

import type { RadarDataCoordinates, InteractionData } from '../types'

interface Props {
    dataCoordinates: RadarDataCoordinates
    dataValues: number[]
    chartWidth: number
    chartHeight: number
    pointsTransformTranslate: string
    circleColour?: string
    tooltipWidth?: number
    displayMargin?: number
    labelFontSize?: string
    contentFontSize?: string
    valueFormatter?: (value: number) => string
}

export default function RadarTooltip({
    dataCoordinates,
    dataValues,
    chartWidth,
    chartHeight,
    pointsTransformTranslate,
    circleColour = 'currentColor',
    tooltipWidth = 100,
    displayMargin = 8,
    labelFontSize = '0.9rem',
    contentFontSize = '0.8rem',
    valueFormatter,
}: Props) {
    const [interactionData, setInteractiondata] =
        useState<InteractionData | null>(null)

    return (
        <>
            <Highlight
                dataCoordinates={dataCoordinates}
                dataValues={dataValues}
                chartWidth={chartWidth}
                chartHeight={chartHeight}
                pointsTransformTranslate={pointsTransformTranslate}
                setInteractiondata={setInteractiondata}
                circleColour={circleColour}
                valueFormatter={valueFormatter}
            />
            <Display
                interactionData={interactionData}
                chartWidth={chartWidth}
                tooltipWidth={tooltipWidth}
                margin={displayMargin}
                labelFontSize={labelFontSize}
                contentFontSize={contentFontSize}
            />
        </>
    )
}

interface HighlightProps {
    dataCoordinates: RadarDataCoordinates
    dataValues: number[]
    chartWidth: number
    chartHeight: number
    pointsTransformTranslate: string
    setInteractiondata: React.Dispatch<
        React.SetStateAction<InteractionData | null>
    >
    circleColour: string
    valueFormatter?: (value: number) => string
}

function Highlight({
    dataCoordinates,
    dataValues,
    chartWidth,
    chartHeight,
    pointsTransformTranslate,
    setInteractiondata,
    circleColour,
    valueFormatter,
}: HighlightProps) {
    return (
        <g transform={pointsTransformTranslate}>
            {dataCoordinates.map((d, i) => {
                const circlePosition = polarToCartesian(
                    d[0] - Math.PI / 2,
                    d[1]
                )

                return (
                    <circle
                        key={i}
                        cx={circlePosition.x}
                        cy={circlePosition.y}
                        r={3}
                        stroke={circleColour}
                        strokeWidth={1}
                        fill="white"
                        onMouseEnter={() => {
                            const score =
                                dataValues[i < dataValues.length ? i : 0]

                            setInteractiondata({
                                xPos: circlePosition.x + chartWidth / 2,
                                yPos: circlePosition.y + chartHeight / 2,
                                label: '',
                                content:
                                    'Score: ' +
                                    (valueFormatter !== undefined
                                        ? valueFormatter(score)
                                        : score),
                            })
                        }}
                        onMouseLeave={() => {
                            setInteractiondata(null)
                        }}
                    />
                )
            })}
        </g>
    )
}
