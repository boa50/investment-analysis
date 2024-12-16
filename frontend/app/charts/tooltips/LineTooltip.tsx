import * as d3 from 'd3'
import { useState } from 'react'
import { getHoveredDataPoint } from '../utils'
import Display from './Display'

import type { LineDataset, InteractionData, Margin } from '../types'
import type { ScaleLinear, ScaleTime } from 'd3'

interface Props {
    data: LineDataset
    chartWidth: number
    chartHeight: number
    margin: Margin
    xScale: ScaleLinear<number, number> | ScaleTime<number, number>
    yScale: ScaleLinear<number, number>
    yFormatter?: (value: number) => string
    lineColour?: string
    circleColour?: string
    tooltipWidth?: number
    displayMargin?: number
    labelFontSize?: string
    contentFontSize?: string
    isQuarterDateFormat?: boolean
}

export default function LineTooltip({
    data,
    chartWidth,
    chartHeight,
    margin,
    xScale,
    yScale,
    yFormatter,
    lineColour = 'currentColor',
    circleColour = 'currentColor',
    tooltipWidth = 100,
    displayMargin = 8,
    labelFontSize = '0.9rem',
    contentFontSize = '0.8rem',
    isQuarterDateFormat = false,
}: Props) {
    const [interactionData, setInteractiondata] =
        useState<InteractionData | null>(null)

    return (
        <>
            <Highlight
                width={chartWidth}
                height={chartHeight}
                margin={margin}
                data={data}
                xScale={xScale}
                yScale={yScale}
                setInteractiondata={setInteractiondata}
                yFormatter={yFormatter}
                lineColour={lineColour}
                circleColour={circleColour}
                isQuarterDateFormat={isQuarterDateFormat}
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
    width: number
    height: number
    margin: Margin
    data: LineDataset
    xScale: ScaleLinear<number, number> | ScaleTime<number, number>
    yScale: ScaleLinear<number, number>
    setInteractiondata: React.Dispatch<
        React.SetStateAction<InteractionData | null>
    >
    yFormatter: ((value: number) => string) | undefined
    lineColour: string
    circleColour: string
    isQuarterDateFormat: boolean
}

function Highlight({
    width,
    height,
    margin,
    data,
    xScale,
    yScale,
    setInteractiondata,
    yFormatter,
    lineColour,
    circleColour,
    isQuarterDateFormat,
}: HighlightProps) {
    const [highlightedPoint, setHighlightedPoint] = useState<number | null>(
        null
    )

    return (
        <>
            <rect
                x={margin.left}
                y={0}
                height={height - margin.bottom}
                width={width - margin.left - margin.right}
                fill="transparent"
                onMouseMove={(event) => {
                    const [dataPoint, idx] = getHoveredDataPoint(
                        event,
                        data,
                        xScale
                    )

                    if (idx !== highlightedPoint) {
                        setHighlightedPoint(idx)

                        setInteractiondata({
                            xPos: xScale(dataPoint.x),
                            yPos: yScale(dataPoint.y),
                            label:
                                yFormatter !== undefined
                                    ? yFormatter(dataPoint.y)
                                    : '',
                            content:
                                dataPoint.x instanceof Date
                                    ? d3.timeFormat(
                                          isQuarterDateFormat
                                              ? 'Trim %q %Y'
                                              : '%d/%m/%Y'
                                      )(dataPoint.x)
                                    : dataPoint.x.toLocaleString(),
                        })
                    }
                }}
                onMouseLeave={(event) => {
                    const isOutOfBounds =
                        d3.pointer(event)[0] + 1 > width - margin.right ||
                        d3.pointer(event)[0] - 1 < margin.left ||
                        d3.pointer(event)[1] > height - margin.bottom ||
                        d3.pointer(event)[1] < margin.top

                    if (isOutOfBounds && highlightedPoint !== null) {
                        setHighlightedPoint(null)
                        setInteractiondata(null)
                    }
                }}
            />
            {data.map((d, i) => {
                return (
                    <g
                        key={`tooltip-${i}`}
                        style={{
                            display: highlightedPoint === i ? 'block' : 'none',
                        }}
                    >
                        <line
                            x1={xScale(d.x)}
                            x2={xScale(d.x)}
                            y1={0}
                            y2={height - margin.bottom}
                            stroke={lineColour}
                            strokeWidth={1}
                            strokeDasharray={'7, 5'}
                        />
                        <circle
                            cx={xScale(d.x)}
                            cy={yScale(d.y)}
                            r={3}
                            stroke={circleColour}
                            strokeWidth={1}
                            fill="white"
                        />
                    </g>
                )
            })}
        </>
    )
}
