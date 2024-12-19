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
    circleColours?: string[]
    nVariables?: number
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
    circleColours = ['currentColor'],
    nVariables = 1e10,
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
                circleColours={circleColours}
                nVariables={nVariables}
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
    circleColours: string[]
    nVariables: number
    valueFormatter?: (value: number) => string
}

function Highlight({
    dataCoordinates,
    dataValues,
    chartWidth,
    chartHeight,
    pointsTransformTranslate,
    setInteractiondata,
    circleColours,
    nVariables,
    valueFormatter,
}: HighlightProps) {
    const [highlightedPoint, setHighlightedPoint] = useState<number | null>(
        null
    )

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
                        r={5}
                        stroke={
                            circleColours[
                                Math.floor(i / nVariables) %
                                    circleColours.length
                            ]
                        }
                        strokeWidth={1}
                        fill="white"
                        style={{
                            opacity: highlightedPoint === i ? 1 : 0,
                            transition: 'opacity 0.1s ease-in-out',
                        }}
                        onMouseEnter={() => {
                            setHighlightedPoint(i)

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
                            setHighlightedPoint(null)
                        }}
                    />
                )
            })}
        </g>
    )
}
