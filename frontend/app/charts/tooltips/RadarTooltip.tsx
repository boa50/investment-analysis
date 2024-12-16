import { useState } from 'react'
import { polarToCartesian } from '../utils'
import Display from './Display'

import type { RadarDataCoordinates, InteractionData } from '../types'

interface Props {
    dataCoordinates: RadarDataCoordinates
    chartWidth: number
    chartHeight: number
    pointsTransformTranslate: string
    circleColour?: string
    tooltipWidth?: number
    displayMargin?: number
    labelFontSize?: string
    contentFontSize?: string
}

export default function RadarTooltip({
    dataCoordinates,
    chartWidth,
    chartHeight,
    pointsTransformTranslate,
    circleColour = 'currentColor',
    tooltipWidth = 100,
    displayMargin = 8,
    labelFontSize = '0.9rem',
    contentFontSize = '0.8rem',
}: Props) {
    const [interactionData, setInteractiondata] =
        useState<InteractionData | null>(null)

    return (
        <>
            <Highlight
                dataCoordinates={dataCoordinates}
                chartWidth={chartWidth}
                chartHeight={chartHeight}
                pointsTransformTranslate={pointsTransformTranslate}
                setInteractiondata={setInteractiondata}
                circleColour={circleColour}
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
    chartWidth: number
    chartHeight: number
    pointsTransformTranslate: string
    setInteractiondata: React.Dispatch<
        React.SetStateAction<InteractionData | null>
    >
    circleColour: string
}

function Highlight({
    dataCoordinates,
    chartWidth,
    chartHeight,
    pointsTransformTranslate,
    setInteractiondata,
    circleColour,
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
                            setInteractiondata({
                                xPos: circlePosition.x + chartWidth / 2,
                                yPos: circlePosition.y + chartHeight / 2,
                                label: '',
                                content:
                                    'Score: ' + circlePosition.y.toString(),
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
